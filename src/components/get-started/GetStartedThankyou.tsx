"use client";
import React, { useEffect } from "react";
import { Card, Result } from "antd";

const GetStartedThankyou = () => {
  const sendHeight = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage(height, "*");
  };
  useEffect(() => {
    sendHeight();
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.onload = sendHeight;
    window.onresize = sendHeight;
  }, []);
  return (
    <Card bordered={false} className="w-full sm:!p-6 !shadow-2xl rounded-2xl">
      <Result
        status="success"
        title="Thank you for booking with us"
        subTitle="Our team will be in touch with you shortly."
      />
    </Card>
  );
};

export default GetStartedThankyou;
