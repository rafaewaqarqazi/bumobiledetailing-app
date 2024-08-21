import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { Grid } from "antd";
import { useToggle } from "@/hooks";
import { useSession } from "next-auth/react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { authActions } from "@/lib/features/authSlice";
const { useBreakpoint } = Grid;
const SidebarContext = createContext({
  isOn: false,
  toggle: () => {},
  toggleOn: () => {},
  toggleOff: () => {},
  setToggle: (_value: SetStateAction<boolean>) => {},
});

export const SidebarProvider = ({ children }: React.PropsWithChildren) => {
  const session = useSession();
  const { auth } = useSelector(
    ({ auth }: RootState) => ({ auth: auth.auth }),
    shallowEqual,
  );
  const dispatch = useDispatch();
  const value = useToggle(false);
  const screen = useBreakpoint();
  useEffect(() => {
    if (session?.data?.user && !auth) {
      const { accessToken, ...user } = session?.data?.user;
      dispatch(authActions.login(user));
      dispatch(authActions.setToken(accessToken));
    }
  }, [session?.data?.user]);
  useEffect(() => {
    if (!screen.md) {
      value.setToggle(true);
    } else {
      value.setToggle(false);
    }
  }, [screen.md]);
  return (
    <SidebarContext.Provider value={value}>
      {useMemo(() => children, [children])}
    </SidebarContext.Provider>
  );
};

export function useSidebarContext() {
  return useContext(SidebarContext);
}
