import { adminPanelNavigation } from "../lib/tabs";
import { getStyles } from "@/shared/lib/";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { useAuth } from "@/features/AdminAuth";
import { useToggle } from "@/shared/lib";
import { BurgerButton } from "@/shared/ui/BurgerButton";
import { useWindowWidth } from "@techlabteam/useful-hooks";
import { useNavigate } from "react-router-dom";
import style from "./Sidebar.module.scss";
import { getRouteAuth } from "@/shared/lib";

type TabKey = keyof typeof adminPanelNavigation

interface SideBarProps {
  activeFeature: TabKey;
  onTabClick: (key: TabKey) => void;
}

export const SideBar = ({ activeFeature, onTabClick }: SideBarProps) => {
    
    const sidebarTabs = Object.values(adminPanelNavigation);

    const { isOpen, toggle, close } = useToggle(); //ничего не надо типизировать, поскольку они должны выдавать уже типизированные данные из коробки, если правильно настроены
    const width = useWindowWidth();
    const isMobile = width <= 768;

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
    try {
        await logout();
        navigate(getRouteAuth());
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Logout error:", error.message);
            } else {
                console.error("Unknown logout error", error);
            }
        }
    };

    return (
        <>
            {isMobile && (
                <Stack max className={style.burger}>
                    <BurgerButton
                        isOpen={isOpen}
                        toggleMenu={toggle}
                        ariaLabel="Toggle Sidebar"
                    />
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
                                    onTabClick(key as TabKey);
                                    close();
                                }}
                                className={getStyles(
                                    style.link,
                                    { [style.active]: activeFeature === key }, 
                                    []
                                )}
                            >
                                {label.toUpperCase()}
                            </Button>
                        </li>
                    ))}
                </ul>

                <Button
                    size="sm"
                    variant='primary'
                    onClick={handleLogout}
                >
                    Sign Out
                </Button>
            </Stack>
        </>
    );
};
