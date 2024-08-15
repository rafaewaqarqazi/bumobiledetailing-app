"use client";
import React from "react";
import { Button } from "antd";
import { signOut } from "next-auth/react";

const Main = () => {
  const onClick = () => {
    signOut()
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  return (
    <div className="flex flex-col flex-1 justify-center items-center ">
      <div className="max-w-lg w-full">
        <Button onClick={onClick}>Logout</Button>
      </div>
    </div>
  );
};

export default Main;
