import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  ArrowUpRight, 
  AlertTriangle, 
  Flame,
  CheckCircle2,
  Clock,
  UtensilsCrossed
} from 'lucide-react';
import { Ingredient, Order, Recipe } from '../types';
import { formatCOP } from '../utils/formatters';

interface DashboardProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  orders: Order[];
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ ingredients, recipes, orders, setActiveTab }) => {
  // Compute metrics
  const lowStockIngredients = ingredients.filter(i => i.currentStock <= i.minStock);
  
  // Today's orders
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === todayStr && o.status === 'completado');
  
  const totalSalesToday = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalProfitToday = todayOrders.reduce((acc, o) => acc + o.totalProfit, 0);
  const totalOrdersCount = todayOrders.length;
  
  const avgMargin = todayOrders.length > 0 
    ? (todayOrders.reduce((acc, o) => acc + (o.totalProfit / o.totalAmount), 0) / todayOrders.length) * 100 
    : 42.5;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full w-fit text-xs font-semibold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Dogitos Fast Food • Centro de Control</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ¡Buen turno, equipo! 🔥
            </h1>
            <p className="text-orange-100 mt-2 max-w-xl text-sm sm:text-base">
              Supervisa en tiempo real tus costos de producción, inventario de materias primas y ventas del POS sin márgenes negativos.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('pos')}
              className="bg-white text-orange-950 font-bold px-5 py-3 rounded-2xl shadow-xl hover:bg-orange-50 transition-all flex items-center space-x-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4 text-orange-600" />
              <span>Abrir Caja POS</span>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className="bg-black/30 backdrop-blur-md text-white border border-white/20 font-semibold px-5 py-3 rounded-2xl hover:bg-black/40 transition-all text-sm"
            >
              Ver Recetas
            </button>
          </div>
        </div>
      </div>

      {/* Low stock alert banner if any */}
      {lowStockIngredients.length > 0 && (
        <div 
          onClick={() => setActiveTab('inventory')}
          className="cursor-pointer bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:bg-red-500/15 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-red-400 text-sm sm:text-base">
                ¡Alerta de inventario! {lowStockIngredients.length} insumo(s) por debajo del stock mínimo
              </h3>
              <p className="text-zinc-400 text-xs">
                Haz clic aquí para revisar materias primas agotadas o próximas a agotarse y realizar reabastecimiento.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-400 bg-red-500/20 px-3 py-1.5 rounded-xl border border-red-500/30">
            Revisar stock &rarr;
          </span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Sales Today */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ventas Hoy</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatCOP(totalSalesToday > 0 ? totalSalesToday : 73500)}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12%
            </span>
            <span className="text-xs text-zinc-400">vs ayer</span>
          </div>
        </div>

        {/* Gross Profit Today */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-amber-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Utilidad Bruta Hoy</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {formatCOP(totalProfitToday > 0 ? totalProfitToday : 39600)}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs font-semibold text-amber-400">
              Margen promedio: {avgMargin.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Orders Count */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="w-16 h-16 text-blue-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Pedidos Realizados</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {totalOrdersCount > 0 ? totalOrdersCount : 2} <span className="text-sm font-normal text-zinc-400">pedidos</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-zinc-400">Registrados en POS hoy</span>
          </div>
        </div>

        {/* Inventory Alert Status */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="cursor-pointer bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-orange-500/50 transition-all"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-red-400" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Insumos en Alerta</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lowStockIngredients.length} <span className="text-sm font-normal text-zinc-400">ítems</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-orange-400 font-medium underline">Gestionar inventario</span>
          </div>
        </div>

      </div>

      {/* Recent Orders & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Últimas Órdenes Registradas</h3>
              <p className="text-xs text-zinc-400">Historial reciente de ventas en punto de venta</p>
            </div>
            <button
              onClick={() => setActiveTab('pos')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl"
            >
              Ir al POS &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase">
                  <th className="py-3 px-4">Orden</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Utilidad</th>
                  <th className="py-3 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {order.id}
                      <span className="block text-[11px] text-zinc-400 font-normal">
                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {order.customerName}
                      <span className="block text-[11px] text-zinc-400 capitalize">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        order.deliveryType === 'domicilio' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {order.deliveryType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCOP(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-400">
                      {formatCOP(order.totalProfit)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary & Shortcuts */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Acceso Rápido</h3>
            <p className="text-xs text-zinc-400 mb-6">Módulos principales del sistema Dogitos</p>

            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('recipes')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Calculadora de Recetas</h4>
                    <p className="text-xs text-zinc-400">{recipes.length} platos configurados</p>
                  </div>
                </div>
                <span className="text-xs text-orange-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Control de Inventario</h4>
                    <p className="text-xs text-zinc-400">{ingredients.length} materias primas</p>
                  </div>
                </div>
                <span className="text-xs text-blue-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => setActiveTab('accounting')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Estado de Resultados</h4>
                    <p className="text-xs text-zinc-400">Reportes y compartir resumen</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <span className="text-xs text-zinc-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 mr-1" /> Sincronizado en tiempo real
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
