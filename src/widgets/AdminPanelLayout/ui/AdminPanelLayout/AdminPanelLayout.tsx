import { useState } from 'react';
import { SideBar } from '../Sidebar/ui/Sidebar';
import { Stack } from '@/shared/ui/Stack';
import { Toast } from '@/shared/ui/Toast';
import { getEditFeaturesMap, defaultFeature } from '../../lib/editFeaturesMap'
import type { TabKey } from '../../lib/tabs';
import style from './AdminPanelLayout.module.scss';

export const AdminPanelLayout = () => {
  const [activeFeature, setActiveFeature] = useState<TabKey>(defaultFeature);

  const handleTabClick = (featureKey: TabKey): void => {
    setActiveFeature(featureKey);
  };

  // Вызываем функцию и получаем объект со всеми вкладками
  const featuresMap = getEditFeaturesMap(handleTabClick);

  return (
    <Stack className={style.adminContainer} align="stretch">
      <SideBar activeFeature={activeFeature} onTabClick={handleTabClick} />
      <Stack tag="main" align="center" justify="center" className={style.mainContent}>
        {/* Рендерим текущую активную вкладку */}
        {featuresMap[activeFeature] || <div>Feature not found</div>}
      </Stack>
      
      <Toast />
    </Stack>
  );
};
