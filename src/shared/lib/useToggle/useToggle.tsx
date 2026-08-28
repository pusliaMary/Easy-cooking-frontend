import { useState } from "react";

interface UseToggleReturn {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useToggle = (initialState: boolean = false): UseToggleReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return { isOpen, toggle, close };
};
