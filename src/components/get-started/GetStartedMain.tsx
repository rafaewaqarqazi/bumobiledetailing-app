"use client";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Flex, Form, Input, message, Row } from "antd";
import {
  FormItem,
  Paragraph,
  Text,
  Title,
} from "@/components/antd-sub-components";
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
import { getErrorMsg, getGAAddOns, getTotalPrice } from "@/utils/helpers";
import { useAddOns } from "@/hooks/addOns.hooks";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { usePathname, useRouter } from "next/navigation";
import ReactGA from "react-ga4";
import { environment } from "@/utils/config";
import { couponCrud, ICoupon } from "@/utils/crud/coupon.crud";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";

const GetStartedMain = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [visible, setVisible] = useState(false);
  const [couponText, setCouponText] = useState("");
  const [code, setCode] = useState<Partial<ICoupon> | null>({
    code: "LABOR",
    discountPercentage: "15",
  });
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const { addOns } = useAddOns({});
  const router = useRouter();
  const pathname = usePathname();
  const sendHeight = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage(height, "*");
  };
  useEffect(() => {
    sendHeight();
  }, [step]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.onload = sendHeight;
    window.onresize = sendHeight;
  }, []);
  useEffect(() => {
    if (environment.ga4MeasurementId && !environment.DEV) {
      ReactGA.initialize(environment.ga4MeasurementId);
    }
  }, []);

  const title = useMemo(() => {
    switch (step) {
      case 1:
        return "Choose Car";
      case 2:
        return "Choose service";
      case 3:
        return "Choose package";
      case 6:
        return "Schedule Appointment";
      default:
        return "Book Appointment";
    }
  }, [step]);
  const subtitle = useMemo(() => {
    switch (step) {
      case 1:
        return "Which car do you have?";
      case 2:
        return "Which service would you like to choose?";
      case 3:
        return "Which package would you prefer?";
      case 6:
        return "Premium Mobile Detailing Packages Tailored to Your Vehicle's Needs";
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
    const total = getTotalPrice({
      package: values.package,
      addOns: addOns,
      customerAddOns: values.customerAddOns,
    });
    let discountAmount = 0;
    if (code) {
      if (code?.discountPercentage) {
        discountAmount = (total * Number(code?.discountPercentage)) / 100;
      } else {
        discountAmount = Number(code?.discountAmount);
      }
    }
    const totalPrice = (Number(total) - Number(discountAmount))?.toFixed(2);
    bookingCrud
      .create({
        vehicle: {
          type: values.car?.type,
          make: carInfo?.[1],
          model: carInfo?.[2],
          year: carInfo?.[0],
        },
        service: values.service?.id,
        package: values.package?.id,
        customerAddOns: values.customerAddOns,
        timeslot: {
          date: values.timeslot?.date,
          timeslot: values.timeslot?.timeslot?.id,
        },
        customer: customer?.id,
        totalPrice: `${totalPrice}`,
      })
      .then(() => {
        message.success("Booking created successfully");
        setLoading(false);
        const _addOns: any[] = getGAAddOns({
          customerAddOns: values.customerAddOns,
          addOns,
          package: values.package,
        });
        ReactGA.event("purchase", {
          value: totalPrice,
          currency: "USD",
          coupon: (code as ICoupon | null)?.code || "",
          items: [
            {
              item_id: values.package?.id,
              item_name: values.package?.name,
              affiliation: environment.appName,
              discount: discountAmount,
              index: 0,
              price: Number(totalPrice),
              quantity: 1,
            },
            ..._addOns,
          ],
        });
        ReactGA.event("conversion", {
          send_to: `${environment.gAdsKey}/6zOrCOytwM4ZEImMhZE-`,
          value: totalPrice,
          currency: "USD",
        });

        router.push(
          `/get-started${pathname?.includes("-popup") ? "-popup" : ""}/thankyou/${values?.package?.id}`,
        );
      })
      .catch((err) => {
        message.error(getErrorMsg(err));
        setLoading(false);
      });
  };
  const toggleCoupon = () => {
    setVisible((prevState) => !prevState);
  };
  const handleChangeCoupon = (e: ChangeEvent<HTMLInputElement>) => {
    setCouponText(e.target.value);
  };
  const onApplyCoupon = () => {
    setLoadingCoupon(true);
    couponCrud
      .getByCode(couponText)
      .then((res) => {
        setCode(res.data.data);
        setLoadingCoupon(false);
        message.success("Coupon applied successfully");
      })
      .catch((err) => {
        message.error(getErrorMsg(err));
        setLoadingCoupon(false);
      });
  };
  const onRemoveCoupon = () => {
    setCode(null);
    setCouponText("");
    setVisible(false);
  };
  return (
    <Card bordered={false} className="w-full sm:!p-6 !shadow-2xl rounded-2xl">
      {step !== 6 && (
        <Paragraph strong className="text-justify">
          Premium Mobile Detailing Packages Tailored to Your Vehicle{`'`}s Needs
        </Paragraph>
      )}
      {step === 1 && (
        <>
          <Paragraph>
            <Text strong>Special Promotion: </Text>
            <Text>15% off your detailing appointment.</Text>
          </Paragraph>
          <Paragraph>
            <Text strong>Free:</Text> <Text>12 point car checkup</Text>
          </Paragraph>
        </>
      )}
      {step > 1 && (
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={back} />
      )}
      {(step < 4 || step === 6) && (
        <>
          <Title
            level={3}
            className="!font-semibold !mt-0 !text-3xl text-center"
          >
            {title}
          </Title>
          <Title
            level={5}
            type="secondary"
            className="!mt-0 !mb-12 !font-normal text-center"
          >
            {subtitle}
          </Title>
        </>
      )}

      <Form layout="vertical" size="small" form={form} onFinish={onFinish}>
        <FormItem name="car" className={`${step !== 1 ? "hidden" : ""} !mb-0`}>
          <GetStartedCar
            next={next}
            customer={customer}
            sendHeight={sendHeight}
          />
        </FormItem>
        <FormItem
          name="service"
          className={`${step !== 2 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedService next={next} customer={customer} />
        </FormItem>
        <FormItem
          name="package"
          className={`${step !== 3 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedPackage next={next} customer={customer} />
        </FormItem>
        <FormItem
          name="customerAddOns"
          className={`${step !== 4 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedAddOns next={next} addOns={addOns} customer={customer} />
        </FormItem>
        <FormItem
          name="timeslot"
          className={`${step !== 5 ? "hidden" : ""} !mb-0`}
        >
          <GetStartedTimeslot next={next} addOns={addOns} customer={customer} />
        </FormItem>
        {step === 6 && (
          <GetStartedBookAppointment
            next={next}
            customer={customer}
            setCustomer={setCustomer}
            sendHeight={sendHeight}
          />
        )}
        {step === 7 && (
          <>
            <GetStartedSummary
              addOns={addOns}
              code={code as ICoupon}
              customer={customer}
            />
            <Flex gap={8}>
              <HandThumbUpIcon className="text-secondary" width={18} />{" "}
              <Paragraph type="secondary" className="!my-4 !font-bold">
                100% Satisfaction Guaranteed
              </Paragraph>
            </Flex>
            <GetStartedTermsOfService />
            {code && code.code && (
              <Flex justify="space-between" className="mb-4">
                <Text type="success">{code.code} Applied</Text>
                <Button type="text" onClick={onRemoveCoupon}>
                  Remove
                </Button>
              </Flex>
            )}
            {!visible && !(code && !code.code) && (
              <Button
                type="text"
                size="small"
                className=" mb-4"
                onClick={toggleCoupon}
              >
                <Text underline>Have a coupon code?</Text>
              </Button>
            )}
            {visible && !code && (
              <>
                <Row align={"middle"} gutter={[8, 8]} className="mb-4">
                  <Col xs={24}>
                    <Input
                      id="coupon"
                      value={couponText}
                      onChange={handleChangeCoupon}
                      size="middle"
                      placeholder={"Enter coupon code"}
                    />
                  </Col>
                  <Col xs={24}>
                    <Button
                      size="middle"
                      block={!code}
                      loading={loadingCoupon}
                      onClick={onApplyCoupon}
                      htmlType="button"
                    >
                      Apply
                    </Button>
                  </Col>
                </Row>
              </>
            )}
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
