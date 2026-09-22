import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Share2, 
  X, 
  MapPin, 
  User, 
  Phone, 
  Flame,
  QrCode
} from 'lucide-react';
import { Recipe, Ingredient, CartItem, Order, BusinessConfig, InventoryMovement } from '../types';
import { formatCOP, calculateRecipeCost } from '../utils/formatters';

interface PosModuleProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  movements: InventoryMovement[];
  setMovements: React.Dispatch<React.SetStateAction<InventoryMovement[]>>;
  config: BusinessConfig;
}

export const PosModule: React.FC<PosModuleProps> = ({
  recipes,
  ingredients,
  setIngredients,
  orders,
  setOrders,
  setMovements,
  config,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'local' | 'domicilio'>('local');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'nequi' | 'tarjeta' | 'transferencia'>('efectivo');

  // Validation warning modal state if stock is insufficient
  const [stockValidationError, setStockValidationError] = useState<string[] | null>(null);

  // Successful receipt modal state
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Ingredients lookup map
  const ingredientsMap = new Map<string, Ingredient>();
  ingredients.forEach(i => ingredientsMap.set(i.id, i));

  // Categories
  const categories = ['ALL', 'Perros Calientes', 'Salchipapas', 'Bebidas', 'Adiciones'];

  // Filter recipes
  const filteredRecipes = recipes.filter(r => {
    if (!r.active) return false;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Add to cart
  const handleAddToCart = (recipe: Recipe) => {
    const prodCost = calculateRecipeCost(recipe, ingredientsMap);
    setCart(prev => {
      const existing = prev.find(item => item.recipeId === recipe.id);
      if (existing) {
        return prev.map(item => item.recipeId === recipe.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, {
          recipeId: recipe.id,
          name: recipe.name,
          quantity: 1,
          unitPrice: recipe.sellingPrice,
          productionCost: prodCost,
          items: recipe.items,
        }];
      }
    });
  };

  const handleUpdateCartQty = (recipeId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.recipeId === recipeId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (recipeId: string) => {
    setCart(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  // Cart Totals
  const totalCartAmount = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalCartCost = cart.reduce((acc, item) => acc + (item.productionCost * item.quantity), 0);
  const totalCartProfit = totalCartAmount - totalCartCost;

  // Strict stock validation before checkout
  const validateStockBeforeCheckout = (): string[] | null => {
    // Tally total required ingredients for cart items
    const requiredMap = new Map<string, { name: string; required: number; unit: string }>();

    for (const cartItem of cart) {
      for (const recipeItem of cartItem.items) {
        const totalNeeded = recipeItem.quantity * cartItem.quantity;
        const ing = ingredientsMap.get(recipeItem.ingredientId);
        if (ing) {
          const current = requiredMap.get(ing.id);
          if (current) {
            current.required += totalNeeded;
          } else {
            requiredMap.set(ing.id, { name: ing.name, required: totalNeeded, unit: ing.unit });
          }
        }
      }
    }

    const missingItems: string[] = [];
    requiredMap.forEach((val, ingId) => {
      const ing = ingredientsMap.get(ingId);
      if (ing && ing.currentStock < val.required) {
        missingItems.push(`- ${val.name}: Se requieren ${val.required} ${val.unit}, pero solo hay ${ing.currentStock} ${val.unit} disponibles.`);
      }
    });

    return missingItems.length > 0 ? missingItems : null;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Strict validation
    const missing = validateStockBeforeCheckout();
    if (missing) {
      setStockValidationError(missing);
      return;
    }

    // Process order & deduct inventory
    // 1. Tally ingredient deductions
    const deductions = new Map<string, number>();
    for (const cartItem of cart) {
      for (const recipeItem of cartItem.items) {
        const totalNeeded = recipeItem.quantity * cartItem.quantity;
        deductions.set(recipeItem.ingredientId, (deductions.get(recipeItem.ingredientId) || 0) + totalNeeded);
      }
    }

    // 2. Update ingredients stock & record movements
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowISO = new Date().toISOString();

    setIngredients(prev => prev.map(ing => {
      const needed = deductions.get(ing.id);
      if (needed) {
        return { ...ing, currentStock: Math.max(0, ing.currentStock - needed) };
      }
      return ing;
    }));

    // Record movement for each deducted ingredient
    const newMovements: InventoryMovement[] = [];
    deductions.forEach((qty, ingId) => {
      const ing = ingredientsMap.get(ingId);
      if (ing) {
        newMovements.push({
          id: `mov-${Date.now()}-${ingId}`,
          ingredientId: ingId,
          ingredientName: ing.name,
          type: 'VENTA',
          quantity: qty,
          unit: ing.unit,
          unitCost: ing.unitCost,
          totalCost: qty * ing.unitCost,
          date: nowISO,
          notes: `Venta POS Orden ${orderId}`,
        });
      }
    });
    setMovements(prev => [...newMovements, ...prev]);

    // 3. Create Order
    const newOrder: Order = {
      id: orderId,
      date: nowISO,
      items: [...cart],
      totalAmount: totalCartAmount,
      totalCost: totalCartCost,
      totalProfit: totalCartProfit,
      paymentMethod,
      status: 'completado',
      customerName: customerName.trim() || 'Cliente Mostrador',
      phone: customerPhone.trim(),
      deliveryType,
      address: deliveryType === 'domicilio' ? address.trim() : undefined,
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);

    // Reset Cart & Form
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      
      {/* Catalog Section (Left 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-black text-white tracking-tight">Punto de Venta (POS)</h2>
          <p className="text-xs text-zinc-400 mt-1">Selecciona platos para armar pedidos con validación estricta de inventario.</p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar plato en POS..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-transparent'
                }`}
              >
                {cat === 'ALL' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredRecipes.map(recipe => {
            const prodCost = calculateRecipeCost(recipe, ingredientsMap);
            const profit = recipe.sellingPrice - prodCost;

            return (
              <div
                key={recipe.id}
                onClick={() => handleAddToCart(recipe)}
                className="cursor-pointer bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/50 hover:scale-[1.02] transition-all flex flex-col justify-between group"
              >
                <div className="relative h-36 overflow-hidden bg-zinc-950">
                  <img
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80'}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                    {recipe.category}
                  </span>
                  <span className="absolute bottom-3 left-4 text-lg font-black text-white">
                    {formatCOP(recipe.sellingPrice)}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{recipe.name}</h4>
                    <span className="text-[11px] text-zinc-400">Utilidad: <strong className="text-emerald-400">{formatCOP(profit)}</strong></span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md group-hover:bg-orange-500 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart & Checkout Panel (Right 5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col justify-between sticky top-24">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-white text-lg">Orden Actual</h3>
              </div>
              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} ítems
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 my-4 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.recipeId} className="bg-zinc-800/50 border border-zinc-800 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <span className="text-xs text-zinc-400">{formatCOP(item.unitPrice)} c/u</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateCartQty(item.recipeId, -1)}
                      className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateCartQty(item.recipeId, 1)}
                      className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveCartItem(item.recipeId)}
                      className="text-red-400 hover:text-red-300 p-1 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-10 text-zinc-500 text-sm italic">
                  Tu carrito está vacío. Selecciona platos del catálogo.
                </div>
              )}
            </div>

            {/* Customer & Delivery Form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Cliente</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Nombre del cliente"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Tel / WhatsApp"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Tipo de Pedido</label>
                  <select
                    value={deliveryType}
                    onChange={e => setDeliveryType(e.target.value as 'local' | 'domicilio')}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="local">Consumo Local / Recoger</option>
                    <option value="domicilio">Domicilio 🛵</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Método de Pago</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="efectivo">Efectivo 💵</option>
                    <option value="nequi">Nequi 📱</option>
                    <option value="tarjeta">Tarjeta 💳</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              {deliveryType === 'domicilio' && (
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Dirección de Entrega</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="Calle, Barrio, Número de casa/apto"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* Nequi QR Code preview if selected */}
              {paymentMethod === 'nequi' && (
                <div className="bg-zinc-950 p-3 rounded-2xl border border-orange-500/30 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Pago Nequi: {config.nequiNumber}</span>
                    <span className="text-zinc-400">Muestra el código QR al cliente para escanear y transferir.</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Totals & Confirm Button */}
          <div className="pt-4 border-t border-zinc-800 mt-4 space-y-3">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Costo de producción:</span>
              <span className="font-mono text-red-400">{formatCOP(totalCartCost)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Utilidad estimada:</span>
              <span className="font-mono text-amber-400">{formatCOP(totalCartProfit)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-extrabold text-white">
              <span>Total a Pagar:</span>
              <span className="text-xl font-black text-emerald-400">{formatCOP(totalCartAmount)}</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center space-x-2 ${
                cart.length > 0 
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white hover:opacity-95 shadow-orange-600/30' 
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Venta y Descontar Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stock Validation Error Modal */}
      {stockValidationError && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/50 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Stock Insuficiente</h3>
            <p className="text-xs text-zinc-400 mb-4">
              La venta no pudo ser procesada porque los siguientes insumos superan el stock disponible en inventario:
            </p>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-red-500/20 space-y-2 mb-6 max-h-40 overflow-y-auto">
              {stockValidationError.map((err, idx) => (
                <div key={idx} className="text-xs text-red-300 font-mono">
                  {err}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStockValidationError(null)}
              className="w-full py-3 rounded-xl bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition-all"
            >
              Entendido, Corregir
            </button>
          </div>
        </div>
      )}

      {/* Success Order Receipt Modal */}
      {lastCompletedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">¡Venta Exitosa!</h3>
            <p className="text-xs text-zinc-400 mt-1">Orden {lastCompletedOrder.id} registrada y stock descontado automáticamente.</p>

            {/* Receipt Summary Box */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left my-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                <span>Cliente:</span>
                <span className="font-bold text-white">{lastCompletedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                <span>Método de pago:</span>
                <span className="font-bold text-white uppercase">{lastCompletedOrder.paymentMethod}</span>
              </div>
              <div className="space-y-1 py-1">
                {lastCompletedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-300">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-mono">{formatCOP(it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-extrabold text-sm text-emerald-400 pt-2 border-t border-zinc-800">
                <span>Total Pagado:</span>
                <span>{formatCOP(lastCompletedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const receiptText = `*${config.name}* - Recibo ${lastCompletedOrder.id}\nCliente: ${lastCompletedOrder.customerName}\nTotal: ${formatCOP(lastCompletedOrder.totalAmount)}\nMétodo: ${lastCompletedOrder.paymentMethod}\n¡Gracias por tu compra! 🔥`;
                  if (navigator.share) {
                    navigator.share({ title: 'Comprobante Dogitos', text: receiptText }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(receiptText);
                    alert('Comprobante copiado al portapapeles.');
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-200 font-bold text-xs hover:bg-zinc-700 flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir</span>
              </button>
              <button
                onClick={() => setLastCompletedOrder(null)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-lg hover:opacity-95"
              >
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
