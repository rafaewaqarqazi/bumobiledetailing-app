import React, { FC, PropsWithChildren } from "react";
const AuthLayout: FC<PropsWithChildren & { maxWidth?: string }> = ({
  maxWidth = "max-w-lg",
  children,
}) => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center !bg-bodyBG">
      <div className={`${maxWidth} w-full`}>{children}</div>
    </div>
  );
};

export default AuthLayout;
