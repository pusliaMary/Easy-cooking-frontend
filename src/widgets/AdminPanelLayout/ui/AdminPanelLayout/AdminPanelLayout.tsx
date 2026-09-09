import { useState } from 'react';
import { SideBar } from '../Sidebar/ui/Sidebar';
import { Toast } from '@/shared/ui/Toast';
import { getEditFeaturesMap, defaultFeature } from '../../lib/editFeaturesMap';
import type { TabKey } from '../../lib/tabs';
import style from './AdminPanelLayout.module.scss';

export const AdminPanelLayout = () => {
  const [activeFeature, setActiveFeature] = useState<TabKey>(defaultFeature);
  // Добавляем стейт для хранения id выбранного рецепта
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleTabClick = (featureKey: TabKey): void => {
    setActiveFeature(featureKey);
  };

  // Вызываем карту с передачей стейта и коллбэков
  const featuresMap = getEditFeaturesMap({
    onChangeTab: handleTabClick,
    onSelectRecipe: setSelectedRecipeId,
    selectedRecipeId,
  });

  // Для подсветки сайдбара: Recipes List должен гореть и при редактировании, и при создании
  const currentActiveForSidebar = 
    activeFeature === 'createRecipe' || activeFeature === 'editRecipe' 
      ? 'recipesList' 
      : activeFeature;

  return (
    <div className={style.layoutWrapper}>
      <SideBar activeFeature={currentActiveForSidebar} onTabClick={handleTabClick} />
      
      <main className={style.mainContent}>
        {featuresMap[activeFeature] || <div>Feature not found</div>}
      </main>
      
      <Toast />
    </div>
  );
};
