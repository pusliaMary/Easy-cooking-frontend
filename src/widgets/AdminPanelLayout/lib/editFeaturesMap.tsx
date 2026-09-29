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
  setIsFormDirty: (dirty: boolean) => void;
}

export const getEditFeaturesMap = ({
  onChangeTab,
  onSelectRecipe,
  selectedRecipeId,
  setIsFormDirty, // <-- Деструктуризируем
}: GetEditFeaturesMapParams): Record<TabKey, ReactNode> => {
  
  const handleBack = () => {
    onSelectRecipe(null);
    onChangeTab(adminPanelNavigation.recipesList.key);
  };

  return {
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
        onSuccess={handleBack} 
        onCancel={handleBack} 
        setIsFormDirty={setIsFormDirty}
      />
    ),
    editRecipe: (
      <RecipesAdmin 
        recipeId={selectedRecipeId}
        onSuccess={handleBack} 
        onCancel={handleBack} 
        setIsFormDirty={setIsFormDirty}
      />
    ),
  };
};
