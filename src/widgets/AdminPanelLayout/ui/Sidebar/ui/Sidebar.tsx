import { useNavigate } from 'react-router-dom';
import { useWindowWidth } from '@techlabteam/useful-hooks';
import { useAuth } from '@/features/AdminAuth';
import { useToggle, getStyles, getRouteAuth } from '@/shared/lib';
import { Button } from '@/shared/ui/Button';
import { Stack } from '@/shared/ui/Stack';
import { BurgerButton } from '@/shared/ui/BurgerButton';
import { toast } from '@/shared/ui/Toast';
import { adminPanelNavigation } from '../../../lib/tabs';
import type { TabKey } from '../../../lib/tabs';

import style from './Sidebar.module.scss';

interface SideBarProps {
  activeFeature: TabKey;
  onTabClick: (key: TabKey) => void;
}

export const SideBar = ({ activeFeature, onTabClick }: SideBarProps) => {
  const sidebarTabs = Object.values(adminPanelNavigation);
  const { isOpen, toggle, close } = useToggle();
  const width = useWindowWidth();
  const isMobile = width <= 820; // Синхронизировано с брейкпоинтом $tablet-m (820px) в ваших медиа-запросах
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      toast.success("You have been successfully logged out.");
      navigate(getRouteAuth());
    } catch (error: unknown) {
      toast.error("Failed to sign out. Please try again.");
      if (error instanceof Error) {
        console.error('Logout error:', error.message);
      } else {
        console.error('Unknown logout error', error);
      }
    }
  };

  return (
    <>
      {isMobile && (
        <Stack max className={style.burger}>
          <BurgerButton isOpen={isOpen} toggleMenu={toggle} ariaLabel="Toggle Sidebar" />
        </Stack>
      )}
      <Stack
        tag="aside"
        direction="column"
        align="center"
        justify="between"
        className={getStyles(style.sidebar, { [style.open]: isOpen }, [])}
      >
        <ul className={style.menu}>
          {sidebarTabs.map(({ key, label }) => (
            <li key={key}>
              <Button
                onClick={() => {
                  onTabClick(key);
                  close();
                }}
                className={getStyles(
                  style.link,
                  { [style.active]: activeFeature === key },
                  []
                )}
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
        <Button size="sm" variant="primary" onClick={handleLogout}>
          Sign Out
        </Button>
      </Stack>
    </>
  );
};
