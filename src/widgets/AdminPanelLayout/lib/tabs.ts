export interface NavigationItem {
  key: string;
  label: string;
}

// В этом объекте остаются ТОЛЬКО те табы, которые должны рендериться в сайдбаре
export const adminPanelNavigation = {
  recipesList: {
    key: 'recipesList',
    label: 'Recipes List',
  },
} as const satisfies Record<string, NavigationItem>;

// Добавляем 'createRecipe' в объединенный тип, чтобы он был валидным ключом для вкладок
export type TabKey = keyof typeof adminPanelNavigation | 'createRecipe';
