export type UnitType = 'g' | 'ml' | 'un';

export type MovementType = 'COMPRA' | 'VENTA' | 'MERMA' | 'DEVOLUCIÓN';

export interface Ingredient {
  id: string;
  name: string;
  unit: UnitType;
  currentStock: number;
  minStock: number;
  unitCost: number; // Cost per 1g, 1ml, or 1 unit
  category: string;
}

export interface InventoryMovement {
  id: string;
  ingredientId: string;
  ingredientName: string;
  type: MovementType;
  quantity: number;
  unit: UnitType;
  unitCost: number;
  totalCost: number;
  date: string;
  notes?: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number; // Quantity needed per recipe portion
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  imageUrl?: string;
  items: RecipeItem[];
  notes?: string;
  active: boolean;
}

export interface CartItem {
  recipeId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  productionCost: number;
  items: RecipeItem[];
}

export type PaymentMethod = 'efectivo' | 'nequi' | 'tarjeta' | 'transferencia';
export type DeliveryType = 'local' | 'domicilio';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  paymentMethod: PaymentMethod;
  status: 'completado' | 'cancelado';
  customerName: string;
  phone?: string;
  deliveryType: DeliveryType;
  address?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface BusinessConfig {
  name: string;
  slogan: string;
  phone: string;
  address: string;
  taxId: string;
  nequiNumber: string;
  bankDetails: string;
  operatingExpensesMonthly: number;
  qrText: string;
  qrImage?: string;
}
