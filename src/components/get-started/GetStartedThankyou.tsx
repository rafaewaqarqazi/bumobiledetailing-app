"use client";
import React from "react";
import { Card, Result } from "antd";

const GetStartedThankyou = () => {
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
