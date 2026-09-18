import { useState } from 'react';
import { SideBar } from '../Sidebar/ui/Sidebar';
import { getEditFeaturesMap, defaultFeature } from '../../lib/editFeaturesMap';
import type { TabKey } from '../../lib/tabs';
import style from './AdminPanelLayout.module.scss';

export const AdminPanelLayout = () => {
  const [activeFeature, setActiveFeature] = useState<TabKey>(defaultFeature);
  
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleTabClick = (featureKey: TabKey): void => {
    setActiveFeature(featureKey);
  };

  
  const featuresMap = getEditFeaturesMap({
    onChangeTab: handleTabClick,
    onSelectRecipe: setSelectedRecipeId,
    selectedRecipeId,
  });

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
      
    </div>
  );
};
