export interface FilterItem {
  label: string;
  value: string;
}

export const filteredMeal: FilterItem[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Supper", value: "supper" },
  { label: "Dinner", value: "dinner" }
];

export const filteredRecipeBase: FilterItem[] = [
  { label: "Meat", value: "meat" },
  { label: "Seafood", value: "seafood" },
  { label: "Poultry", value: "poultry" },
  { label: "Vegan", value: "vegan" }
];