import type { ReactNode } from 'react';
import { RecipesAdmin } from '@/features/RecipesAdmin';
import { RecipePreview } from '@/features/RecipesAdmin/ui/RecipePreview/RecipePreview';
import { adminPanelNavigation } from './tabs';
import type { TabKey } from './tabs';

export const defaultFeature: TabKey = adminPanelNavigation.recipesList.key;

export const getEditFeaturesMap = (onChangeTab: (key: TabKey) => void): Record<TabKey, ReactNode> => ({
  recipesList: (
    <RecipePreview
      onAddNewClick={() => onChangeTab('createRecipe')} 
    />
  ),
  createRecipe: (
    <RecipesAdmin 
      onSuccess={() => onChangeTab(adminPanelNavigation.recipesList.key)} 
    />
  ),
});
