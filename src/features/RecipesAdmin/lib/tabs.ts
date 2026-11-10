export interface NavigationItem {
  key: string;
  label: string;
}

export const adminPanelNavigation = {
  recipesList: {
    key: 'recipesList',
    label: 'Recipes List',
  },
} as const satisfies Record<string, NavigationItem>;

export type TabKey = keyof typeof adminPanelNavigation | 'createRecipe' | 'editRecipe';
