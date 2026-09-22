import { Ingredient, Recipe, Order, Expense, BusinessConfig } from './types';

export const initialConfig: BusinessConfig = {
  name: 'Dogitos Fast Food',
  slogan: 'Los mejores perros calientes y comidas rápidas al instante',
  phone: '+57 300 123 4567',
  address: 'Calle 50 # 20-15, Esquina del Sabor',
  taxId: '900.123.456-1',
  nequiNumber: '300 123 4567',
  bankDetails: 'Bolivariana Ahorros # 123-456789-00',
  operatingExpensesMonthly: 2500000, // $2,500,000 COP monthly fixed expenses
  qrText: 'https://nequi.com.co/pagos/dogitosqr',
  qrImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
};

export const initialIngredients: Ingredient[] = [
  { id: 'ing-1', name: 'Salchicha Ranchera Premium', unit: 'g', currentStock: 5000, minStock: 1000, unitCost: 35, category: 'Carnes' },
  { id: 'ing-2', name: 'Pan de Perro Artesanal', unit: 'un', currentStock: 120, minStock: 30, unitCost: 900, category: 'Panadería' },
  { id: 'ing-3', name: 'Queso Mozzarella Rallado', unit: 'g', currentStock: 3000, minStock: 800, unitCost: 28, category: 'Lácteos' },
  { id: 'ing-4', name: 'Tocineta Ahumada en Tiras', unit: 'g', currentStock: 2000, minStock: 500, unitCost: 45, category: 'Carnes' },
  { id: 'ing-5', name: 'Papas Fritas Fosforito', unit: 'g', currentStock: 4000, minStock: 1000, unitCost: 18, category: 'Acompañamientos' },
  { id: 'ing-6', name: 'Salsa Rosada Especial', unit: 'ml', currentStock: 2500, minStock: 500, unitCost: 15, category: 'Salsas' },
  { id: 'ing-7', name: 'Salsa de Piña Artesanal', unit: 'ml', currentStock: 2000, minStock: 400, unitCost: 14, category: 'Salsas' },
  { id: 'ing-8', name: 'Mostaza Gourmet', unit: 'ml', currentStock: 1500, minStock: 300, unitCost: 12, category: 'Salsas' },
  { id: 'ing-9', name: 'Queso Cheddar Fundido', unit: 'ml', currentStock: 3000, minStock: 600, unitCost: 32, category: 'Lácteos' },
  { id: 'ing-10', name: 'Gaseosa 400ml (Lata/Personal)', unit: 'un', currentStock: 95, minStock: 24, unitCost: 2200, category: 'Bebidas' },
  { id: 'ing-11', name: 'Pollo desmechado', unit: 'g', currentStock: 3500, minStock: 1000, unitCost: 30, category: 'Carnes' },
];

// Fix reference typo for category
initialIngredients[0].category = 'Carnes';

export const initialRecipes: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Perro Dogitos Clásico',
    category: 'Perros Calientes',
    sellingPrice: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
    active: true,
    notes: 'El clásico de la casa con salchicha ranchera y papas fosforito.',
    items: [
      { ingredientId: 'ing-1', quantity: 100 }, // 100g salchicha
      { ingredientId: 'ing-2', quantity: 1 },   // 1 pan
      { ingredientId: 'ing-3', quantity: 40 },  // 40g queso
      { ingredientId: 'ing-5', quantity: 30 },  // 30g papas
      { ingredientId: 'ing-6', quantity: 20 },  // 20ml salsa rosada
      { ingredientId: 'ing-7', quantity: 15 },  // 15ml piña
    ],
  },
  {
    id: 'rec-2',
    name: 'Perro Megatocineta y Cheddar',
    category: 'Perros Calientes',
    sellingPrice: 18500,
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80',
    active: true,
    notes: 'Exquisito perro con doble tocineta crujiente y baño de cheddar.',
    items: [
      { ingredientId: 'ing-1', quantity: 100 },
      { ingredientId: 'ing-2', quantity: 1 },
      { ingredientId: 'ing-4', quantity: 40 }, // tocineta
      { ingredientId: 'ing-9', quantity: 50 }, // cheddar
      { ingredientId: 'ing-5', quantity: 35 },
      { ingredientId: 'ing-6', quantity: 20 },
    ],
  },
  {
    id: 'rec-3',
    name: 'Perro Super Pollo & Queso',
    category: 'Perros Calientes',
    sellingPrice: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1577906002787-17e1742460de?w=600&auto=format&fit=crop&q=80',
    active: true,
    notes: 'Pollo jugoso desmechado con queso fundido y salsas.',
    items: [
      { ingredientId: 'ing-11', quantity: 120 }, // pollo
      { ingredientId: 'ing-2', quantity: 1 },
      { ingredientId: 'ing-3', quantity: 50 },
      { ingredientId: 'ing-5', quantity: 30 },
      { ingredientId: 'ing-6', quantity: 25 },
    ],
  },
  {
    id: 'rec-4',
    name: 'Salchipapa Dogitos Especial',
    category: 'Salchipapas',
    sellingPrice: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
    active: true,
    notes: 'Porción generosa de papas, salchicha en rodajas, pollo y queso gratinado.',
    items: [
      { ingredientId: 'ing-5', quantity: 250 }, // 250g papas
      { ingredientId: 'ing-1', quantity: 150 }, // 150g salchicha
      { ingredientId: 'ing-11', quantity: 100 }, // 100g pollo
      { ingredientId: 'ing-3', quantity: 70 },   // 70g queso
      { ingredientId: 'ing-6', quantity: 40 },
    ],
  },
  {
    id: 'rec-5',
    name: 'Gaseosa Personal 400ml',
    category: 'Bebidas',
    sellingPrice: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    active: true,
    notes: 'Bebida fría en lata o botella personal.',
    items: [
      { ingredientId: 'ing-10', quantity: 1 },
    ],
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    items: [
      { recipeId: 'rec-1', name: 'Perro Dogitos Clásico', quantity: 2, unitPrice: 12000, productionCost: 5200, items: initialRecipes[0].items },
      { recipeId: 'rec-5', name: 'Gaseosa Personal 400ml', quantity: 2, unitPrice: 4500, productionCost: 2200, items: initialRecipes[4].items },
    ],
    totalAmount: 33000,
    totalCost: 14800,
    totalProfit: 18200,
    paymentMethod: 'nequi',
    status: 'completado',
    customerName: 'Carlos Mendoza',
    phone: '3104445566',
    deliveryType: 'local',
  },
  {
    id: 'ORD-1002',
    date: new Date(Date.now() - 3600000 * 1).toISOString(),
    items: [
      { recipeId: 'rec-2', name: 'Perro Megatocineta y Cheddar', quantity: 1, unitPrice: 18500, productionCost: 7850, items: initialRecipes[1].items },
      { recipeId: 'rec-4', name: 'Salchipapa Dogitos Especial', quantity: 1, unitPrice: 22000, productionCost: 11250, items: initialRecipes[3].items },
    ],
    totalAmount: 40500,
    totalCost: 19100,
    totalProfit: 21400,
    paymentMethod: 'efectivo',
    status: 'completado',
    customerName: 'Ana Lucía Gómez',
    phone: '3209998877',
    deliveryType: 'domicilio',
    address: 'Calle 70 # 15-20 Apto 302',
  },
];

export const initialExpenses: Expense[] = [
  { id: 'exp-1', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Compra de servilletas y bolsas kraft', amount: 85000, category: 'Insumos Operativos' },
  { id: 'exp-2', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Gas propano cilindro 40kg', amount: 110000, category: 'Servicios' },
  { id: 'exp-3', date: new Date(Date.now() - 86400000 * 10).toISOString(), description: 'Publicidad Redes Sociales (Meta Ads)', amount: 150000, category: 'Marketing' },
];
