import type { ReactNode } from 'react';
import { RecipesAdmin } from '@/features/RecipesAdmin';
import { adminPanelNavigation } from './tabs';
import type { TabKey } from './tabs';

export const defaultFeature: TabKey = adminPanelNavigation.recipes.key;

export const editFeaturesMap: Record<TabKey, ReactNode> = {
  recipes: <RecipesAdmin />,
};