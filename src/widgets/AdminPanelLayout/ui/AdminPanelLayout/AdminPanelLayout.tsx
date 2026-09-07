import { useState } from 'react';
import { SideBar } from '../Sidebar/ui/Sidebar';
import { Toast } from '@/shared/ui/Toast';
import { getEditFeaturesMap, defaultFeature } from '../../lib/editFeaturesMap';
import type { TabKey } from '../../lib/tabs';
import style from './AdminPanelLayout.module.scss';

export const AdminPanelLayout = () => {
  const [activeFeature, setActiveFeature] = useState<TabKey>(defaultFeature);

  const handleTabClick = (featureKey: TabKey): void => {
    setActiveFeature(featureKey);
  };

  const featuresMap = getEditFeaturesMap(handleTabClick);

  return (
    <div className={style.layoutWrapper}>
      {/* Сайдбар идет первым флекс-элементом */}
      <SideBar activeFeature={activeFeature} onTabClick={handleTabClick} />
      
      {/* Блок main идет вторым и занимает ВСЁ оставшееся пространство рядом */}
      <main className={style.mainContent}>
        {featuresMap[activeFeature] || <div>Feature not found</div>}
      </main>
      
      <Toast />
    </div>
  );
};
