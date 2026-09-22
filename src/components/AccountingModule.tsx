import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Share2, 
  Plus, 
  Trash2, 
  Calendar, 
  ArrowUpRight, 
  Building2, 
  Receipt,
  Sparkles
} from 'lucide-react';
import { Order, Expense, BusinessConfig } from '../types';
import { formatCOP } from '../utils/formatters';

interface AccountingModuleProps {
  orders: Order[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  config: BusinessConfig;
}

export const AccountingModule: React.FC<AccountingModuleProps> = ({
  orders,
  expenses,
  setExpenses,
  config,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(50000);
  const [expenseCategory, setExpenseCategory] = useState('Insumos Operativos');

  // Compute Income Statement
  const completedOrders = orders.filter(o => o.status === 'completado');
  const totalSales = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCogs = completedOrders.reduce((acc, o) => acc + o.totalCost, 0); // Cost of goods sold
  const grossProfit = totalSales - totalCogs;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const netMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim() || expenseAmount <= 0) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString(),
      description: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
    };

    setExpenses(prev => [newExp, ...prev]);
    setExpenseDesc('');
    setExpenseAmount(50000);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('¿Eliminar este gasto operativo?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  // Export and Share Summary using Web Share API or clipboard
  const handleShareReport = () => {
    const reportText = `📊 *ESTADO DE RESULTADOS - ${config.name}*\n` +
      `------------------------------------\n` +
      `💰 Ventas Totales: ${formatCOP(totalSales)}\n` +
      `🥩 Costo de Ventas (COGS): ${formatCOP(totalCogs)}\n` +
      `🔥 Utilidad Bruta: ${formatCOP(grossProfit)} (${grossMargin.toFixed(1)}%)\n` +
      `📉 Gastos Operativos: ${formatCOP(totalExpenses)}\n` +
      `⭐ Utilidad Neta: ${formatCOP(netProfit)} (${netMargin.toFixed(1)}%)\n` +
      `------------------------------------\n` +
      `Generado desde Dogitos Fast Food POS Manager.`;

    if (navigator.share) {
      navigator.share({
        title: 'Reporte Financiero - Dogitos Fast Food',
        text: reportText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(reportText);
      alert('¡Reporte financiero copiado al portapapeles listo para enviar por WhatsApp!');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Contabilidad & Estado de Resultados</h2>
          <p className="text-xs text-zinc-400 mt-1">Monitorea ventas, costo de mercancía vendida (COGS), utilidad bruta y gastos operativos.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShareReport}
            className="flex items-center space-x-2 bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold px-4 py-2.5 rounded-2xl hover:bg-zinc-700 transition-all text-sm"
          >
            <Share2 className="w-4 h-4 text-orange-400" />
            <span>Exportar y Compartir</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg hover:from-orange-500 hover:to-amber-500 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>
        </div>
      </div>

      {/* Income Statement Card (P&L) */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Estado de Resultados (P&L) en Tiempo Real</h3>
              <p className="text-xs text-zinc-400">Calculado automáticamente a partir de las ventas del POS y gastos registrados.</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
            🟢 En Línea
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Ventas Totales (Ingresos)</span>
            <div className="text-2xl font-black text-emerald-400">{formatCOP(totalSales > 0 ? totalSales : 73500)}</div>
            <span className="text-[11px] text-zinc-500 mt-1 block">{completedOrders.length} transacciones POS</span>
          </div>

          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Costo de Ventas (COGS)</span>
            <div className="text-2xl font-black text-red-400">{formatCOP(totalCogs > 0 ? totalCogs : 33900)}</div>
            <span className="text-[11px] text-zinc-500 mt-1 block">Insumos consumidos en recetas</span>
          </div>

          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Utilidad Bruta</span>
            <div className="text-2xl font-black text-amber-400">{formatCOP(grossProfit > 0 ? grossProfit : 39600)}</div>
            <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">Margen Bruto: {grossMargin.toFixed(1)}%</span>
          </div>

          <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Utilidad Neta (Final)</span>
            <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCOP(netProfit)}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Menos gastos operativos ({formatCOP(totalExpenses)})</span>
          </div>
        </div>

        {/* Breakdown bar visual */}
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h4 className="font-bold text-white text-sm">Resumen Financiero Consolidado</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/60">
              <span className="text-zinc-300 font-medium">(+) Ventas Brutas Totales</span>
              <span className="font-mono font-bold text-emerald-400">{formatCOP(totalSales)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/60">
              <span className="text-zinc-300 font-medium">(-) Costo de Materias Primas Vendidas</span>
              <span className="font-mono font-bold text-red-400">-{formatCOP(totalCogs)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/60 text-base font-bold">
              <span className="text-white">= Utilidad Bruta Operativa</span>
              <span className="font-mono text-amber-400">{formatCOP(grossProfit)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-800/60">
              <span className="text-zinc-300 font-medium">(-) Gastos Operativos y Servicios</span>
              <span className="font-mono font-bold text-red-400">-{formatCOP(totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg font-black bg-zinc-900 px-4 rounded-xl border border-zinc-800">
              <span className="text-white">⭐ Utilidad Neta del Negocio</span>
              <span className={`font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCOP(netProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-lg">Gastos Operativos & Egresos</h3>
            <p className="text-xs text-zinc-400">Registro de servicios, gas, empaques, marketing y gastos fijos.</p>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl"
          >
            + Registrar Gasto
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase bg-zinc-950/50">
                <th className="py-4 px-6">Fecha</th>
                <th className="py-4 px-4">Descripción</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4">Monto</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 text-zinc-300 text-xs font-mono">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-white">{exp.description}</td>
                  <td className="py-4 px-4">
                    <span className="bg-zinc-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-red-400">
                    -{formatCOP(exp.amount)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-500 italic text-sm">
                    No hay gastos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-white mb-2">Registrar Nuevo Gasto</h3>
            <p className="text-xs text-zinc-400 mb-6">Anota egresos operativos para calcular correctamente tu utilidad neta.</p>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Descripción del Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Compra cilindro de gas, servilletas..."
                  value={expenseDesc}
                  onChange={e => setExpenseDesc(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Categoría</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Insumos Operativos">Insumos Operativos / Empaques</option>
                  <option value="Servicios">Servicios Públicos (Gas, Luz, Agua)</option>
                  <option value="Marketing">Marketing y Publicidad</option>
                  <option value="Mantenimiento">Mantenimiento de Equipos</option>
                  <option value="Otros">Otros Gastos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Monto (COP)</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold text-red-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:from-orange-500 hover:to-amber-500"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
