import React, { FC, PropsWithChildren } from "react";
const AuthLayout: FC<PropsWithChildren & { size?: string }> = ({
  size = "lg",
  children,
}) => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center !bg-bodyBG">
      <div className={`max-w-${size} w-full`}>{children}</div>
    </div>
  );
};

export default AuthLayout;
