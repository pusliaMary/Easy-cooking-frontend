import type { ReactNode } from 'react';
import { RecipesAdmin } from '@/features/RecipesAdmin';
import { RecipePreview } from '@/features/RecipesAdmin/ui/RecipePreview/RecipePreview';
import { adminPanelNavigation } from './tabs';
import type { TabKey } from './tabs';

export const defaultFeature: TabKey = adminPanelNavigation.recipesList.key;

interface GetEditFeaturesMapParams {
  onChangeTab: (key: TabKey) => void;
  onSelectRecipe: (id: string | null) => void;
  selectedRecipeId: string | null;
}

export const getEditFeaturesMap = ({
  onChangeTab,
  onSelectRecipe,
  selectedRecipeId,
}: GetEditFeaturesMapParams): Record<TabKey, ReactNode> => ({
  recipesList: (
    <RecipePreview
      onAddNewClick={() => {
        onSelectRecipe(null);
        onChangeTab('createRecipe');
      }} 
      onEditClick={(id) => {
        onSelectRecipe(id);
        onChangeTab('editRecipe');
      }}
    />
  ),
  createRecipe: (
    <RecipesAdmin 
      onSuccess={() => onChangeTab(adminPanelNavigation.recipesList.key)} 
    />
  ),
  editRecipe: (
    <RecipesAdmin 
      recipeId={selectedRecipeId}
      onSuccess={() => {
        onSelectRecipe(null);
        onChangeTab(adminPanelNavigation.recipesList.key);
      }} 
    />
  ),
});
