export interface NavigationItem {
  key: string;
  label: string;
}

// В сайдбаре по-прежнему только список
export const adminPanelNavigation = {
  recipesList: {
    key: 'recipesList',
    label: 'Recipes List',
  },
} as const satisfies Record<string, NavigationItem>;

// Добавляем 'editRecipe' в пул доступных экранов
export type TabKey = keyof typeof adminPanelNavigation | 'createRecipe' | 'editRecipe';
