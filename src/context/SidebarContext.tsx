import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { Grid } from "antd";
import { useToggle } from "@/hooks";
const { useBreakpoint } = Grid;
const SidebarContext = createContext({
  isOn: false,
  toggle: () => {},
  toggleOn: () => {},
  toggleOff: () => {},
  setToggle: (_value: SetStateAction<boolean>) => {},
});

export const SidebarProvider = ({ children }: React.PropsWithChildren) => {
  const value = useToggle(false);
  const screen = useBreakpoint();
  useEffect(() => {
    if (!screen.md) {
      value.setToggle(true);
    } else {
      value.setToggle(false);
    }
  }, [screen.md, value]);
  return (
    <SidebarContext.Provider value={value}>
      {useMemo(() => children, [children])}
    </SidebarContext.Provider>
  );
};

export function useSidebarContext() {
  return useContext(SidebarContext);
}
