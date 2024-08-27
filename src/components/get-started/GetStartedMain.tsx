"use client";
import React, { useMemo, useState } from "react";
import { Button, Card, Form, message } from "antd";
import { FormItem, Title } from "@/components/antd-sub-components";
import GetStartedBookAppointment from "@/components/get-started/GetStarted.BookAppointment";
import { ICustomer } from "@/utils/crud/customer.crud";
import GetStartedCar from "@/components/get-started/GetStarted.Car";
import GetStartedService from "@/components/get-started/GetStarted.Service";
import { ArrowLeftOutlined } from "@ant-design/icons";
import GetStartedPackage from "@/components/get-started/GetStarted.Package";
import GetStartedAddOns from "@/components/get-started/GetStarted.AddOns";
import GetStartedTimeslot from "@/components/get-started/GetStarted.Timeslot";
import GetStartedSummary from "@/components/get-started/GetStarted.Summary";
import GetStartedTermsOfService from "@/components/get-started/GetStarted.TermsOfService";
import { IService } from "@/utils/crud/service.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { ITimeslot } from "@/utils/crud/timeslot.crud";
import { bookingCrud } from "@/utils/crud/booking.crud";
import { getErrorMsg, getTotalPrice } from "@/utils/helpers";
import { useAddOns } from "@/hooks/addOns.hooks";
import { IVehicle } from "@/utils/crud/vehicle.crud";

const GetStartedMain = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const { addOns } = useAddOns({});
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
  const onFinish = (values: {
    car: IVehicle & { info: string };
    service: IService;
    package: IPackage;
    customerAddOns: {
      [key: number]: number;
    };
    timeslot: { date: string; timeslot: ITimeslot };
  }) => {
    setLoading(true);
    const carInfo = values.car?.info.split("/");
    bookingCrud
      .create({
        vehicle: {
          type: values.car?.type,
          make: carInfo[1],
          model: carInfo[2],
          year: carInfo[0],
        },
        service: values.service.id,
        package: values.package.id,
        customerAddOns: values.customerAddOns,
        timeslot: {
          date: values.timeslot.date,
          timeslot: values.timeslot.timeslot.id,
        },
        customer: customer?.id,
        totalPrice: `${getTotalPrice({
          package: values.package,
          addOns: addOns,
          customerAddOns: values.customerAddOns,
        })}`,
      })
      .then(() => {
        message.success("Booking created successfully");
        form.resetFields();
        setCustomer(null);
        setStep(1);
        setLoading(false);
      })
      .catch((err) => {
        message.error(getErrorMsg(err));
        setLoading(false);
      });
  };
  return (
    <Card bordered={false} className="w-full sm:!p-6 !shadow-2xl rounded-2xl">
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
        <FormItem name="car" className={`${step !== 2 ? "hidden" : ""} !mb-0`}>
          <GetStartedCar next={next} customer={customer} />
        </FormItem>
        <FormItem
          name="service"
          className={`${step !== 3 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedService next={next} customer={customer} />
        </FormItem>
        <FormItem
          name="package"
          className={`${step !== 4 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedPackage next={next} customer={customer} />
        </FormItem>
        <FormItem
          name="customerAddOns"
          className={`${step !== 5 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedAddOns next={next} addOns={addOns} customer={customer} />
        </FormItem>
        <FormItem
          name="timeslot"
          className={`${step !== 6 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedTimeslot next={next} addOns={addOns} customer={customer} />
        </FormItem>
        {step === 7 && (
          <>
            <GetStartedSummary addOns={addOns} />
            <GetStartedTermsOfService />
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={loading}
            >
              Confirm Booking
            </Button>
          </>
        )}
      </Form>
    </Card>
  );
};

export default GetStartedMain;
