import React, { useState, useEffect } from 'react';
import { 
  initialIngredients, 
  initialRecipes, 
  initialOrders, 
  initialExpenses, 
  initialConfig 
} from './data';
import { Ingredient, Recipe, Order, Expense, BusinessConfig, InventoryMovement } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { InventoryModule } from './components/InventoryModule';
import { RecipesModule } from './components/RecipesModule';
import { PosModule } from './components/PosModule';
import { AccountingModule } from './components/AccountingModule';
import { SettingsModule } from './components/SettingsModule';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load from localStorage with fallback to initial data
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('dogitos_ingredients');
    return saved ? JSON.parse(saved) : initialIngredients;
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('dogitos_recipes');
    return saved ? JSON.parse(saved) : initialRecipes;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('dogitos_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem('dogitos_movements');
    return saved ? JSON.parse(saved) : [
      {
        id: 'mov-init-1',
        ingredientId: 'ing-1',
        ingredientName: 'Salchicha Ranchera Premium',
        type: 'COMPRA',
        quantity: 5000,
        unit: 'g',
        unitCost: 35,
        totalCost: 175000,
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: 'Inventario inicial stock',
      }
    ];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('dogitos_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [config, setConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem('dogitos_config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('dogitos_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('dogitos_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('dogitos_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('dogitos_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('dogitos_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('dogitos_config', JSON.stringify(config));
  }, [config]);

  // Reset to initial data
  const handleResetData = () => {
    setIngredients(initialIngredients);
    setRecipes(initialRecipes);
    setOrders(initialOrders);
    setMovements([]);
    setExpenses(initialExpenses);
    setConfig(initialConfig);
    localStorage.clear();
    alert('¡Datos restaurados a los valores de fábrica de Dogitos Fast Food!');
  };

  // Low stock alert count
  const lowStockCount = ingredients.filter(i => i.currentStock <= i.minStock).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lowStockCount={lowStockCount} 
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            ingredients={ingredients} 
            recipes={recipes} 
            orders={orders} 
            setActiveTab={setActiveTab} 
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryModule 
            ingredients={ingredients} 
            setIngredients={setIngredients} 
            movements={movements} 
            setMovements={setMovements} 
          />
        )}
        {activeTab === 'recipes' && (
          <RecipesModule 
            recipes={recipes} 
            setRecipes={setRecipes} 
            ingredients={ingredients} 
          />
        )}
        {activeTab === 'pos' && (
          <PosModule 
            recipes={recipes} 
            ingredients={ingredients} 
            setIngredients={setIngredients} 
            orders={orders} 
            setOrders={setOrders} 
            movements={movements} 
            setMovements={setMovements} 
            config={config} 
          />
        )}
        {activeTab === 'accounting' && (
          <AccountingModule 
            orders={orders} 
            expenses={expenses} 
            setExpenses={setExpenses} 
            config={config} 
          />
        )}
        {activeTab === 'settings' && (
          <SettingsModule 
            config={config} 
            setConfig={setConfig} 
            onResetData={handleResetData} 
          />
        )}
      </main>
    </div>
  );
}
