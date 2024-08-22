"use client";
import React, { useMemo, useState } from "react";
import { Button, Card, Form } from "antd";
import { FormItem, Title } from "@/components/antd-sub-components";
import GetStartedBookAppointment from "@/components/get-started/GetStarted.BookAppointment";
import { ICustomer } from "@/utils/crud/customer.crud";
import GetStartedCar from "@/components/get-started/GetStarted.Car";
import GetStartedService from "@/components/get-started/GetStarted.Service";
import { ArrowLeftOutlined } from "@ant-design/icons";
import GetStartedPackage from "@/components/get-started/GetStarted.Package";
import GetStartedAddOns from "@/components/get-started/GetStarted.AddOns";

const GetStartedMain = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState<ICustomer | null>(null);

  const title = useMemo(() => {
    switch (step) {
      case 1:
        return "Book Appointment";
      case 2:
        return "Choose Car";
      case 3:
        return "Choose service";
      case 4:
        return "Choose package";
      default:
        return "Book Appointment";
    }
  }, [step]);
  const subtitle = useMemo(() => {
    switch (step) {
      case 1:
        return "Book your appointment for car detailing.";
      case 2:
        return "Which car do you have?";
      case 3:
        return "Which service would you like to choose?";
      case 4:
        return "Which package would you prefer?";
      default:
        return "Book Appointment";
    }
  }, [step]);
  const next = () => {
    setStep((prevState) => prevState + 1);
  };
  const back = () => {
    setStep((prevState) => prevState - 1);
  };
  const onFinish = () => {};
  return (
    <Card bordered={false} className="w-full !p-6 !shadow-2xl rounded-2xl">
      {step > 1 && (
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={back} />
      )}
      {step < 5 && (
        <>
          <Title level={2} className="!font-semibold !mt-0 !text-4xl">
            {title}
          </Title>
          <Title
            level={5}
            type="secondary"
            className="!mt-0 !mb-12 !font-normal"
          >
            {subtitle}
          </Title>
        </>
      )}

      {step === 1 && (
        <GetStartedBookAppointment next={next} setCustomer={setCustomer} />
      )}
      <Form layout="vertical" size="small" form={form} onFinish={onFinish}>
        <FormItem name="size" className={`${step !== 2 ? "hidden" : ""} !mb-0`}>
          <GetStartedCar next={next} />
        </FormItem>
        <FormItem
          name="service"
          className={`${step !== 3 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedService next={next} />
        </FormItem>
        <FormItem
          name="package"
          className={`${step !== 4 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedPackage next={next} />
        </FormItem>
        <FormItem
          name="customerAddOns"
          className={`${step !== 5 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedAddOns />
        </FormItem>
      </Form>
    </Card>
  );
};

export default GetStartedMain;
