export interface NavigationItem {
  key: string;
  label: string;
}

export const adminPanelNavigation = {
  recipesList: {
    key: 'recipesList',
    label: 'Recipes List',
  },
  createRecipe: {
    key: 'createRecipe',
    label: 'Add New Recipe',
  },
} as const satisfies Record<string, NavigationItem>;

export type TabKey = keyof typeof adminPanelNavigation;
