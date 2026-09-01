import { proteins, categories } from './filters'

export type ProteinType = typeof proteins[number]

export type CategoryType = typeof categories[number]

export interface IngredientItem {
  name: string;
}

export interface Recipe {
  _id?: string;
  imgSource: string;
  title: string;
  category: CategoryType;
  containsProtein: boolean;
  whatProtein?: ProteinType[];
  containsFiber: boolean;
  ingredients: IngredientItem[];
  steps: string[];
  keyWords: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RenderedRecipe extends Recipe {
  renderKey: string;
}

export interface MealGroup {
  mealValue: string;
  mealLabel: string;
  recipes: RenderedRecipe[];
}

