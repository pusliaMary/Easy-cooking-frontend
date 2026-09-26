import { useNavigate } from 'react-router-dom';
import { useWindowWidth } from '@techlabteam/useful-hooks';
import { useState } from 'react';
import { useAuth } from '@/features/AdminAuth';
import { useToggle, getStyles, getRouteAuth } from '@/shared/lib';
import { Button } from '@/shared/ui/Button';
import { Stack } from '@/shared/ui/Stack';
import { Typography } from "@/shared/ui/Typography";
import { BurgerButton } from '@/shared/ui/BurgerButton';
import { adminPanelNavigation } from '../../../lib/tabs';
import type { TabKey } from '../../../lib/tabs';

import styles from './Sidebar.module.scss';

interface SideBarProps {
  activeFeature: TabKey;
  onTabClick: (key: TabKey) => void;
}

export const SideBar = ({ activeFeature, onTabClick }: SideBarProps) => {
  const sidebarTabs = Object.values(adminPanelNavigation);
  const { isOpen, toggle, close } = useToggle();
  const width = useWindowWidth();
  const isMobile = width <= 820;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

const handleLogout = async (): Promise<void> => {
  try {
    setLogoutError(null);
    await logout();
    
    navigate(getRouteAuth());
  } catch (error: unknown) {
      if (error instanceof Error) {
      setLogoutError(`Не удалось выйти: ${error.message}`);
    } else {
      setLogoutError('Произошла ошибка при выходе. Пожалуйста, попробуйте еще раз.');
    }
  }
};

return (
  <>
    {isMobile && (
      <Stack max className={styles.burger}>
        <BurgerButton isOpen={isOpen} toggleMenu={toggle} ariaLabel="Toggle Sidebar" />
      </Stack>
    )}

    <Stack
      tag="aside"
      direction="column"
      align="center"
      justify="between"
      className={getStyles(styles.sidebar, { [styles.open]: isOpen }, [])}
    >
      <ul className={styles.menu}>
        {sidebarTabs.map(({ key, label }) => {
          const isActive = activeFeature === key || (key === 'recipesList' && activeFeature === 'createRecipe');

          return (
            <li key={key}>
              <Button
                onClick={() => {
                  onTabClick(key as TabKey);
                  close();
                }}
                className={getStyles(
                  styles.link,
                  { [styles.active]: isActive },
                  []
                )}
              >
                {label}
              </Button>
            </li>
          );
        })}
      </ul>
      
      <Stack direction="column" align="center" gap={8} style={{ width: '100%' }}>
        {logoutError && (
          <Typography as="span" className={styles.errorText}>
            {logoutError}
          </Typography>
        )}
        
        <Button size="sm" variant="primary" onClick={handleLogout}>
          Sign Out
        </Button>
      </Stack>
    </Stack>
  </>
);

};
