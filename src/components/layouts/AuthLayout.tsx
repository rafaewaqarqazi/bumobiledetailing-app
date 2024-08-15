import React, { FC, PropsWithChildren } from "react";
const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center ">
      <div className="max-w-lg w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
