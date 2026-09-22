import React, { useState } from 'react';
import { Search, X, Check, Calculator, Plus, Trash2 } from 'lucide-react';
import { Ingredient, RecipeItem } from '../types';
import { formatCOP } from '../utils/formatters';

interface IngredientModalProps {
  ingredients: Ingredient[];
  existingItems: RecipeItem[];
  sellingPrice: number;
  onSave: (items: RecipeItem[]) => void;
  onClose: () => void;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  ingredients,
  existingItems,
  sellingPrice,
  onSave,
  onClose,
}) => {
  // Local state map of ingredientId -> quantity
  const [selectedMap, setSelectedMap] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    existingItems.forEach(item => {
      map.set(item.ingredientId, item.quantity);
    });
    return map;
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Filter ingredients
  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleIngredient = (ingredientId: string, defaultQty = 1) => {
    const newMap = new Map(selectedMap);
    if (newMap.has(ingredientId)) {
      newMap.delete(ingredientId);
    } else {
      newMap.set(ingredientId, defaultQty);
    }
    setSelectedMap(newMap);
  };

  const handleQuantityChange = (ingredientId: string, qty: number) => {
    const newMap = new Map(selectedMap);
    newMap.set(ingredientId, Math.max(0, qty));
    setSelectedMap(newMap);
  };

  // Calculate instant total cost and margin
  let estimatedCost = 0;
  selectedMap.forEach((qty, ingId) => {
    const ing = ingredients.find(i => i.id === ingId);
    if (ing) {
      estimatedCost += ing.unitCost * qty;
    }
  });

  const estimatedProfit = sellingPrice - estimatedCost;
  const estimatedMargin = sellingPrice > 0 ? (estimatedProfit / sellingPrice) * 100 : 0;

  const handleConfirm = () => {
    const items: RecipeItem[] = [];
    selectedMap.forEach((quantity, ingredientId) => {
      if (quantity > 0) {
        items.push({ ingredientId, quantity });
      }
    });
    onSave(items);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-black text-white">Selección Avanzada de Insumos</h3>
            <p className="text-xs text-zinc-400 mt-1">Busca, selecciona y define las cantidades exactas requeridas para esta receta.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instant Calculation Card */}
        <div className="my-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-orange-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Costo Estimado</span>
              <div className="text-lg font-black text-white">{formatCOP(estimatedCost)}</div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Utilidad</span>
              <div className={`text-lg font-black ${estimatedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCOP(estimatedProfit)}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Margen</span>
              <div className={`text-lg font-black ${estimatedMargin >= 30 ? 'text-emerald-400' : estimatedMargin > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                {estimatedMargin.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative my-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar ingrediente por nombre..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Ingredients List with checkboxes & quantity inputs */}
        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
          {filteredIngredients.map(ing => {
            const isSelected = selectedMap.has(ing.id);
            const currentQty = selectedMap.get(ing.id) || 100;

            return (
              <div
                key={ing.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-md'
                    : 'bg-zinc-800/40 border-zinc-800 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleIngredient(ing.id, ing.unit === 'un' ? 1 : 50)}
                    className="w-5 h-5 rounded accent-orange-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{ing.name}</h4>
                    <span className="text-xs text-zinc-400">
                      Costo unitario: <strong className="text-emerald-400">{formatCOP(ing.unitCost)}</strong> por {ing.unit}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-zinc-400 font-semibold">Cantidad:</span>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      value={currentQty}
                      onChange={e => handleQuantityChange(ing.id, Number(e.target.value))}
                      className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs font-bold text-orange-400">{ing.unit}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:from-orange-500 hover:to-amber-500"
          >
            Confirmar Ingredientes ({selectedMap.size})
          </button>
        </div>

      </div>
    </div>
  );
};
