"use client";
import React, { useMemo, useState } from "react";
import { Breadcrumb, Card, Form } from "antd";
import { FormItem, Title } from "@/components/antd-sub-components";
import GetStartedBookAppointment from "@/components/get-started/GetStarted.BookAppointment";
import { ICustomer } from "@/utils/crud/customer.crud";
import GetStartedSize from "@/components/get-started/GetStarted.Size";
import GetStartedPackage from "@/components/get-started/GetStarted.Package";

const GetStartedMain = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(2);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const service = Form.useWatch("package", form);
  const onClickStep = (step: number) => () => {
    setStep(step);
  };
  const breadcrumbItems = useMemo(() => {
    const items: {
      title: string;
      onClick?: () => void;
      className?: string;
    }[] = [
      {
        title: "Automotive",
      },
    ];
    if (step >= 2) {
      items.push({
        title: "Size",
        onClick: onClickStep(2),
        className: "cursor-pointer",
      });
    }
    if (step >= 3) {
      items.push({
        title: "Package",
        onClick: onClickStep(3),
        className: "cursor-pointer",
      });
    }
    if (step >= 4) {
      items.push({
        title: service,
        onClick: onClickStep(4),
        className: "cursor-pointer",
      });
    }
    return items;
  }, [step, service]);
  const title = useMemo(() => {
    switch (step) {
      case 1:
        return "Book Appointment";
      case 2:
        return "Select Size";
      case 3:
        return "Select Package";
      default:
        return "Book Appointment";
    }
  }, [step]);
  const next = () => {
    setStep((prevState) => prevState + 1);
  };
  const onFinish = () => {};
  return (
    <Card bordered={false} className="w-full !shadow-2xl rounded-2xl">
      <Title level={3} className="!font-extrabold text-center">
        {title}
      </Title>
      {step > 1 && <Breadcrumb separator=">" items={breadcrumbItems} />}

      {step === 1 && (
        <GetStartedBookAppointment next={next} setCustomer={setCustomer} />
      )}
      <Form layout="vertical" size="small" form={form} onFinish={onFinish}>
        <FormItem name="size" className={`${step !== 2 ? "hidden" : ""}`}>
          <GetStartedSize next={next} />
        </FormItem>
        <FormItem name="package" className={`${step !== 3 ? "hidden" : ""}`}>
          <GetStartedPackage next={next} />
        </FormItem>
      </Form>
    </Card>
  );
};

export default GetStartedMain;
