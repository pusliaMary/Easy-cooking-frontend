// src/entities/recipes/model/types.ts

export type ProteinType = "meat" | "poultry" | "seafood" | "vegan";

export type CategoryType =
  | "salad"
  | "soup"
  | "garnish"
  | "mainCourse"
  | "dessert"
  | "drink";

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
