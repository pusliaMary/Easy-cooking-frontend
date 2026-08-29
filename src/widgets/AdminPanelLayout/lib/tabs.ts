export interface NavigationItem {
  key: string;
  label: string;
}

export const adminPanelNavigation = {
  recipes: {
    key: 'recipes',
    label: 'Recipes',
  },
} as const satisfies Record<string, NavigationItem>;

export type TabKey = keyof typeof adminPanelNavigation;
