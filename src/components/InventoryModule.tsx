import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  ArrowUpDown, 
  History, 
  Edit3, 
  Trash2, 
  X,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  RotateCcw
} from 'lucide-react';
import { Ingredient, InventoryMovement, MovementType, UnitType } from '../types';
import { formatCOP } from '../utils/formatters';

interface InventoryModuleProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  movements: InventoryMovement[];
  setMovements: React.Dispatch<React.SetStateAction<InventoryMovement[]>>;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  ingredients,
  setIngredients,
  movements,
  setMovements,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ingredients' | 'movements'>('ingredients');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Ingredient modal state
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'g' as UnitType,
    currentStock: 1000,
    minStock: 200,
    unitCost: 30,
    category: 'Carnes',
  });

  // Movement modal state
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedIngredientForMov, setSelectedIngredientForMov] = useState<Ingredient | null>(null);
  const [movType, setMovType] = useState<MovementType>('COMPRA');
  const [movQuantity, setMovQuantity] = useState(500);
  const [movNotes, setMovNotes] = useState('');

  // Categories list
  const categories = ['ALL', 'Carnes', 'Panadería', 'Lácteos', 'Salsas', 'Acompañamientos', 'Bebidas'];

  // Filtered ingredients
  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || ing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handle open create/edit ingredient modal
  const handleOpenIngredientModal = (ing?: Ingredient) => {
    if (ing) {
      setEditingIngredient(ing);
      setFormData({
        name: ing.name,
        unit: ing.unit,
        currentStock: ing.currentStock,
        minStock: ing.minStock,
        unitCost: ing.unitCost,
        category: ing.category,
      });
    } else {
      setEditingIngredient(null);
      setFormData({
        name: '',
        unit: 'g',
        currentStock: 1000,
        minStock: 200,
        unitCost: 30,
        category: 'Carnes',
      });
    }
    setIsIngredientModalOpen(true);
  };

  // Save Ingredient
  const handleSaveIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingIngredient) {
      // Update
      setIngredients(prev => prev.map(i => i.id === editingIngredient.id ? {
        ...i,
        name: formData.name,
        unit: formData.unit,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        unitCost: Number(formData.unitCost),
        category: formData.category,
      } : i));
    } else {
      // Create new
      const newIng: Ingredient = {
        id: `ing-${Date.now()}`,
        name: formData.name,
        unit: formData.unit,
        currentStock: Number(formData.currentStock),
        minStock: Number(formData.minStock),
        unitCost: Number(formData.unitCost),
        category: formData.category,
      };
      setIngredients(prev => [...prev, newIng]);

      // Record initial purchase movement
      const newMov: InventoryMovement = {
        id: `mov-${Date.now()}`,
        ingredientId: newIng.id,
        ingredientName: newIng.name,
        type: 'COMPRA',
        quantity: newIng.currentStock,
        unit: newIng.unit,
        unitCost: newIng.unitCost,
        totalCost: newIng.currentStock * newIng.unitCost,
        date: new Date().toISOString(),
        notes: 'Inventario inicial registrado',
      };
      setMovements(prev => [newMov, ...prev]);
    }

    setIsIngredientModalOpen(false);
  };

  // Delete ingredient
  const handleDeleteIngredient = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia prima?')) {
      setIngredients(prev => prev.filter(i => i.id !== id));
    }
  };

  // Open Movement Modal
  const handleOpenMovementModal = (ing: Ingredient) => {
    setSelectedIngredientForMov(ing);
    setMovType('COMPRA');
    setMovQuantity(100);
    setMovNotes('');
    setIsMovementModalOpen(true);
  };

  // Submit Movement
  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredientForMov || movQuantity <= 0) return;

    const qty = Number(movQuantity);
    let stockChange = 0;

    if (movType === 'COMPRA' || movType === 'DEVOLUCIÓN') {
      stockChange = qty;
    } else if (movType === 'VENTA' || movType === 'MERMA') {
      stockChange = -qty;
    }

    // Update ingredient stock
    setIngredients(prev => prev.map(i => {
      if (i.id === selectedIngredientForMov.id) {
        const newStock = Math.max(0, i.currentStock + stockChange);
        return { ...i, currentStock: newStock };
      }
      return i;
    }));

    // Record movement
    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      ingredientId: selectedIngredientForMov.id,
      ingredientName: selectedIngredientForMov.name,
      type: movType,
      quantity: qty,
      unit: selectedIngredientForMov.unit,
      unitCost: selectedIngredientForMov.unitCost,
      totalCost: qty * selectedIngredientForMov.unitCost,
      date: new Date().toISOString(),
      notes: movNotes || `Movimiento manual tipo ${movType}`,
    };

    setMovements(prev => [newMov, ...prev]);
    setIsMovementModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Gestión de Inventario e Insumos</h2>
          <p className="text-xs text-zinc-400 mt-1">Controla materias primas, costos unitarios, stock mínimo y alertas automáticas.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-zinc-800 p-1 rounded-2xl border border-zinc-700">
            <button
              onClick={() => setActiveSubTab('ingredients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'ingredients' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Insumos ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'movements' ? 'bg-orange-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Historial ({movements.length})
            </button>
          </div>
          <button
            onClick={() => handleOpenIngredientModal()}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-lg hover:from-orange-500 hover:to-amber-500 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'ingredients' ? (
        <>
          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar insumo por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-transparent'
                  }`}
                >
                  {cat === 'ALL' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Table */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase bg-zinc-950/50">
                    <th className="py-4 px-6">Materia Prima</th>
                    <th className="py-4 px-4">Categoría</th>
                    <th className="py-4 px-4">Stock Actual</th>
                    <th className="py-4 px-4">Stock Mínimo</th>
                    <th className="py-4 px-4">Costo Unitario</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {filteredIngredients.map(ing => {
                    const isLow = ing.currentStock <= ing.minStock;
                    const isOut = ing.currentStock <= 0;

                    return (
                      <tr key={ing.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs ${
                            isOut ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            isLow ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {ing.unit.toUpperCase()}
                          </div>
                          <div>
                            <span>{ing.name}</span>
                            <span className="block text-xs font-normal text-zinc-400">
                              Costo por {ing.unit}: {formatCOP(ing.unitCost)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-300">
                          <span className="bg-zinc-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-700/60">
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-white">
                          {ing.currentStock.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">{ing.unit}</span>
                        </td>
                        <td className="py-4 px-4 font-mono text-zinc-400">
                          {ing.minStock.toLocaleString()} {ing.unit}
                        </td>
                        <td className="py-4 px-4 font-semibold text-emerald-400">
                          {formatCOP(ing.unitCost)} <span className="text-xs font-normal text-zinc-500">/{ing.unit}</span>
                        </td>
                        <td className="py-4 px-4">
                          {isOut ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Agotado
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Stock Bajo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Óptimo
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenMovementModal(ing)}
                            title="Registrar movimiento (Compra/Merma)"
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenIngredientModal(ing)}
                            title="Editar insumo"
                            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteIngredient(ing.id)}
                            title="Eliminar insumo"
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Movements History Table */
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-lg">Historial de Movimientos de Inventario</h3>
              <p className="text-xs text-zinc-400">Registro completo de compras, ventas automáticas, mermas y devoluciones.</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-xl">
              <History className="w-4 h-4 text-orange-400" />
              <span>{movements.length} movimientos registrados</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase bg-zinc-950/50">
                  <th className="py-4 px-6">Fecha / Hora</th>
                  <th className="py-4 px-4">Tipo Movimiento</th>
                  <th className="py-4 px-4">Insumo</th>
                  <th className="py-4 px-4">Cantidad</th>
                  <th className="py-4 px-4">Costo Unit.</th>
                  <th className="py-4 px-4">Costo Total</th>
                  <th className="py-4 px-6">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {movements.map(mov => {
                  const isPositive = mov.type === 'COMPRA' || mov.type === 'DEVOLUCIÓN';
                  return (
                    <tr key={mov.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-6 text-zinc-300 text-xs font-mono">
                        {new Date(mov.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          mov.type === 'COMPRA' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          mov.type === 'VENTA' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          mov.type === 'MERMA' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {mov.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-white">{mov.ingredientName}</td>
                      <td className={`py-4 px-4 font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : '-'}{mov.quantity.toLocaleString()} {mov.unit}
                      </td>
                      <td className="py-4 px-4 font-mono text-zinc-300">{formatCOP(mov.unitCost)}</td>
                      <td className="py-4 px-4 font-mono font-bold text-white">{formatCOP(mov.totalCost)}</td>
                      <td className="py-4 px-6 text-xs text-zinc-400">{mov.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ingredient Create/Edit Modal */}
      {isIngredientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsIngredientModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-2">
              {editingIngredient ? 'Editar Materia Prima' : 'Nueva Materia Prima'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Configura el costo unitario por gramo, mililitro o unidad.</p>

            <form onSubmit={handleSaveIngredient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Nombre del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Salchicha Ranchera, Queso Mozzarella..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Unidad de Medida</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value as UnitType })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="un">Unidades (un)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Carnes">Carnes</option>
                    <option value="Panadería">Panadería</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Salsas">Salsas</option>
                    <option value="Acompañamientos">Acompañamientos</option>
                    <option value="Bebidas">Bebidas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Stock Actual</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.currentStock}
                    onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Stock Mínimo (Alerta)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Costo Unitario (COP por {formData.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={formData.unitCost}
                  onChange={e => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <span className="block text-[11px] text-zinc-400 mt-1">
                  Ej. Si 1000g costaron $35.000, el costo unitario por gramo es $35.
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsIngredientModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:from-orange-500 hover:to-amber-500"
                >
                  {editingIngredient ? 'Guardar Cambios' : 'Crear Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal */}
      {isMovementModalOpen && selectedIngredientForMov && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsMovementModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-1">Registrar Movimiento</h3>
            <p className="text-xs text-orange-400 font-semibold mb-6">
              Insumo: {selectedIngredientForMov.name} (Stock actual: {selectedIngredientForMov.currentStock} {selectedIngredientForMov.unit})
            </p>

            <form onSubmit={handleSaveMovement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['COMPRA', 'VENTA', 'MERMA', 'DEVOLUCIÓN'] as MovementType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovType(type)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        movType === type
                          ? type === 'COMPRA' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' :
                            type === 'VENTA' ? 'bg-blue-500/20 text-blue-400 border-blue-500' :
                            type === 'MERMA' ? 'bg-red-500/20 text-red-400 border-red-500' :
                            'bg-purple-500/20 text-purple-400 border-purple-500'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Cantidad ({selectedIngredientForMov.unit})
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={movQuantity}
                  onChange={e => setMovQuantity(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <span className="block text-[11px] text-zinc-400 mt-1">
                  Costo estimado de este lote: {formatCOP(movQuantity * selectedIngredientForMov.unitCost)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Notas / Justificación</label>
                <input
                  type="text"
                  placeholder="Ej. Factura #4521, desperdicio por caída..."
                  value={movNotes}
                  onChange={e => setMovNotes(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:from-orange-500 hover:to-amber-500"
                >
                  Confirmar Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
