export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateRecipeCost = (recipe: { items: { ingredientId: string; quantity: number }[] }, ingredientsMap: Map<string, { unitCost: number }>): number => {
  let totalCost = 0;
  for (const item of recipe.items) {
    const ing = ingredientsMap.get(item.ingredientId);
    if (ing) {
      totalCost += ing.unitCost * item.quantity;
    }
  }
  return totalCost;
};
