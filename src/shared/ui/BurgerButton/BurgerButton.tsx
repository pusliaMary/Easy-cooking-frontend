import { getStyles } from "@/shared/lib";
import style from "./BurgerButton.module.scss";

export interface BurgerButtonProos {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
  ariaLabel?: string;
}

export const BurgerButton = ({ isOpen, toggleMenu, className, ariaLabel }: BurgerButtonProos) => {
  return (
    <button
      className={getStyles(style.hamburger, { [style.open]: isOpen }, [
        className,
      ])}
      onClick={toggleMenu}
      type="button"
      aria-label={ariaLabel || "Toggle Menu"}
      aria-expanded={isOpen}
    >
      <div className={style.lineTop}></div>
      <div className={style.lineMiddle}></div>
      <div className={style.lineBottom}></div>
    </button>
  );
};


