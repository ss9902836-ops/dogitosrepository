import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Layers,
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { Recipe, Ingredient, RecipeItem } from '../types';
import { formatCOP } from '../utils/formatters';
import { IngredientModal } from './IngredientModal';

interface RecipesModuleProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  ingredients: Ingredient[];
}

export const RecipesModule: React.FC<RecipesModuleProps> = ({
  recipes,
  setRecipes,
  ingredients,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal states
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Perros Calientes',
    sellingPrice: 15000,
    imageUrl: '',
    notes: '',
    items: [] as RecipeItem[],
  });

  const [isIngredientPickerOpen, setIsIngredientPickerOpen] = useState(false);

  // Ingredients map lookup
  const ingredientsMap = new Map<string, Ingredient>();
  ingredients.forEach(i => ingredientsMap.set(i.id, i));

  // Categories
  const categories = ['ALL', 'Perros Calientes', 'Salchipapas', 'Bebidas', 'Adiciones'];

  // Filtered recipes
  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate production cost helper
  const computeProductionCost = (items: RecipeItem[]) => {
    let cost = 0;
    for (const item of items) {
      const ing = ingredientsMap.get(item.ingredientId);
      if (ing) {
        cost += ing.unitCost * item.quantity;
      }
    }
    return cost;
  };

  const handleOpenCreateRecipe = () => {
    setEditingRecipeId(null);
    setFormData({
      name: '',
      category: 'Perros Calientes',
      sellingPrice: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
      notes: '',
      items: [],
    });
    setIsRecipeModalOpen(true);
  };

  const handleOpenEditRecipe = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setFormData({
      name: recipe.name,
      category: recipe.category,
      sellingPrice: recipe.sellingPrice,
      imageUrl: recipe.imageUrl || '',
      notes: recipe.notes || '',
      items: [...recipe.items],
    });
    setIsRecipeModalOpen(true);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingRecipeId) {
      setRecipes(prev => prev.map(r => r.id === editingRecipeId ? {
        ...r,
        name: formData.name,
        category: formData.category,
        sellingPrice: Number(formData.sellingPrice),
        imageUrl: formData.imageUrl,
        notes: formData.notes,
        items: formData.items,
      } : r));
    } else {
      const newRecipe: Recipe = {
        id: `rec-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        sellingPrice: Number(formData.sellingPrice),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80',
        notes: formData.notes,
        active: true,
        items: formData.items,
      };
      setRecipes(prev => [...prev, newRecipe]);
    }

    setIsRecipeModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Recetas & Calculadora de Costos</h2>
          <p className="text-xs text-zinc-400 mt-1">Cálculo automático de producción, utilidad bruta y margen porcentual por plato.</p>
        </div>
        <button
          onClick={handleOpenCreateRecipe}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg hover:from-orange-500 hover:to-amber-500 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Receta</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar plato o receta..."
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

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => {
          const productionCost = computeProductionCost(recipe.items);
          const profit = recipe.sellingPrice - productionCost;
          const margin = recipe.sellingPrice > 0 ? (profit / recipe.sellingPrice) * 100 : 0;
          const hasNoRecipe = recipe.items.length === 0;
          const isNegative = margin < 0;

          return (
            <div
              key={recipe.id}
              className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden bg-zinc-950">
                  <img
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80'}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl border border-white/10">
                      {recipe.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center space-x-1">
                    {hasNoRecipe ? (
                      <span className="bg-red-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                        Sin Receta
                      </span>
                    ) : isNegative ? (
                      <span className="bg-red-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Margen Negativo
                      </span>
                    ) : (
                      <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {margin.toFixed(1)}% Margen
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-extrabold text-white leading-snug">{recipe.name}</h3>
                  </div>
                </div>

                {/* Costs & Pricing Body */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80 text-center">
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase">Costo Prod.</span>
                      <span className="text-sm font-black text-red-400">{formatCOP(productionCost)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase">Precio Venta</span>
                      <span className="text-sm font-black text-emerald-400">{formatCOP(recipe.sellingPrice)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase">Utilidad</span>
                      <span className="text-sm font-black text-amber-400">{formatCOP(profit)}</span>
                    </div>
                  </div>

                  {/* Ingredients Breakdown */}
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                      Insumos ({recipe.items.length})
                    </span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {recipe.items.map((item, idx) => {
                        const ing = ingredientsMap.get(item.ingredientId);
                        if (!ing) return null;
                        const itemCost = ing.unitCost * item.quantity;
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs bg-zinc-800/40 px-3 py-1.5 rounded-xl border border-zinc-800">
                            <span className="text-zinc-300 truncate max-w-[150px]">{ing.name}</span>
                            <span className="font-mono text-zinc-400">{item.quantity} {ing.unit}</span>
                            <span className="font-mono text-emerald-400 font-semibold">{formatCOP(itemCost)}</span>
                          </div>
                        );
                      })}
                      {recipe.items.length === 0 && (
                        <p className="text-xs text-zinc-500 italic text-center py-2">No hay insumos asociados a esta receta.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-zinc-800/60 mt-4">
                <span className="text-xs text-zinc-500 italic truncate max-w-[180px]">
                  {recipe.notes || 'Sin notas adicionales'}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditRecipe(recipe)}
                    className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all"
                    title="Editar Receta"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    title="Eliminar Receta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Create/Edit Modal */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-white mb-2">
              {editingRecipeId ? 'Editar Receta' : 'Nueva Receta de Plato'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Configura precio de venta y asocia materias primas con cálculo automático de costos.</p>

            <form onSubmit={handleSaveRecipe} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Nombre del Plato / Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Perro Especial Dogitos..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Perros Calientes">Perros Calientes</option>
                    <option value="Salchipapas">Salchipapas</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Adiciones">Adiciones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Precio de Venta al Público (COP)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formData.sellingPrice}
                    onChange={e => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">URL de Imagen</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Associated Ingredients Section */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">Ingredientes de la Receta</h4>
                    <p className="text-xs text-zinc-400">
                      Costo de producción actual: <strong className="text-orange-400">{formatCOP(computeProductionCost(formData.items))}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsIngredientPickerOpen(true)}
                    className="flex items-center space-x-1.5 bg-orange-600/20 border border-orange-500/40 text-orange-400 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-orange-600/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Seleccionar Insumos</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formData.items.map((item, index) => {
                    const ing = ingredientsMap.get(item.ingredientId);
                    if (!ing) return null;
                    const itemCost = ing.unitCost * item.quantity;
                    return (
                      <div key={index} className="flex justify-between items-center bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                        <div>
                          <span className="font-bold text-white text-xs">{ing.name}</span>
                          <span className="block text-[11px] text-zinc-400">
                            {item.quantity} {ing.unit} &bull; Costo unit: {formatCOP(ing.unitCost)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs font-bold text-emerald-400">{formatCOP(itemCost)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = formData.items.filter((_, i) => i !== index);
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {formData.items.length === 0 && (
                    <div className="text-center py-6 text-zinc-500 text-xs italic">
                      Haz clic en "Seleccionar Insumos" para abrir el selector avanzado.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Notas / Preparación</label>
                <textarea
                  rows={2}
                  placeholder="Detalles de preparación..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRecipeModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:from-orange-500 hover:to-amber-500"
                >
                  {editingRecipeId ? 'Guardar Cambios' : 'Crear Receta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Ingredient Selection Modal / BottomSheet */}
      {isIngredientPickerOpen && (
        <IngredientModal
          ingredients={ingredients}
          existingItems={formData.items}
          sellingPrice={formData.sellingPrice}
          onSave={items => {
            setFormData({ ...formData, items });
            setIsIngredientPickerOpen(false);
          }}
          onClose={() => setIsIngredientPickerOpen(false)}
        />
      )}
    </div>
  );
};
