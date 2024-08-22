import { useCallback, useMemo, useState } from "react";

export function useToggle(defaultIsOn = false) {
  const [isOn, setToggle] = useState(defaultIsOn);
  const toggleOn = useCallback(() => setToggle(true), []);
  const toggleOff = useCallback(() => setToggle(false), []);
  const toggle = useCallback(() => setToggle((prevIsOn) => !prevIsOn), []);
  return useMemo(
    () => ({ isOn, toggleOn, toggleOff, toggle, setToggle }),
    [isOn, toggleOn, toggleOff, toggle, setToggle],
  );
}

export interface IHooksList {
  setPagination?: (pagination: any) => void;
  current?: number;
  pageSize?: number;
  total?: number;
  [key: string]: any;
}
