import React, { useEffect, useMemo } from "react";
import { Button, Card, Divider, Flex, Form, Popover } from "antd";
import Image from "next/image";
import { Text, Title } from "@/components/antd-sub-components";
import {
  currencyFormatter,
  getGAAddOns,
  getTotalDurationByAddOns,
  getTotalPrice,
} from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import Icon, { ClockCircleOutlined, PushpinOutlined } from "@ant-design/icons";
import { IAddOn } from "@/utils/crud/addOn.crud";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import ReactGA from "react-ga4";
import { environment } from "@/utils/config";
import { ICoupon } from "@/utils/crud/coupon.crud";
import dayjs from "dayjs";
import { ICustomer } from "@/utils/crud/customer.crud";

const GetStartedSummary = ({
  addOns,
  code,
  customer,
}: {
  addOns: IAddOn[];
  code: ICoupon | null;
  customer: ICustomer | null;
}) => {
  const form = Form.useFormInstance();
  const _package: IPackage = Form.useWatch("package", form);
  const timeslot = Form.useWatch("timeslot", form);

  const customerAddOns: {
    [key: number]: number;
  } = Form.useWatch("customerAddOns", form);
  const totalPrice = useMemo(
    () =>
      getTotalPrice({
        addOns,
        package: _package,
        customerAddOns,
      }),

    [customerAddOns, _package, addOns],
  );
  const discountAmount = useMemo(() => {
    if (code) {
      if (code.discountPercentage) {
        return (totalPrice * Number(code.discountPercentage)) / 100;
      } else {
        return Number(code.discountAmount);
      }
    }
    return 0;
  }, [code, totalPrice]);
  const totalDuration = useMemo(
    () => getTotalDurationByAddOns({ customerAddOns, addOns }),
    [customerAddOns, addOns],
  );
  useEffect(() => {
    const _addOns: any[] = getGAAddOns({
      customerAddOns,
      addOns,
      package: _package,
    });
    ReactGA.event("add_to_cart", {
      value: Number((totalPrice || 0).toFixed(2)),
      currency: "USD",
      items: [
        {
          item_id: _package?.id,
          item_name: _package?.name,
          affiliation: environment.appName,
          discount: 0,
          index: 0,
          price: Number(totalPrice),
          quantity: 1,
        },
        ..._addOns,
      ],
    });
    ReactGA.event("begin_checkout", {
      value: Number((totalPrice || 0).toFixed(2)),
      currency: "USD",
      items: [
        {
          item_id: _package?.id,
          item_name: _package?.name,
          affiliation: environment.appName,
          discount: 0,
          index: 0,
          price: Number(totalPrice),
          quantity: 1,
        },
        ..._addOns,
      ],
    });
  }, []);
  return (
    <div>
      <Title level={2} className="!font-semibold !mt-0 !text-4xl">
        Booking Summary
      </Title>
      <Card className="!p-1">
        <Flex gap={16} align="center" className="relative">
          <div>
            <Image
              src={_package?.image}
              alt={_package?.name}
              width={48}
              height={48}
              className="rounded-2xl"
            />
          </div>
          <div>
            <Title level={4} className="!mt-0">
              {_package?.displayName}
            </Title>
            <Title
              level={5}
              type="secondary"
              className="!mt-0 !mb-0 !font-extrabold !text-colorGrey"
            >
              {currencyFormatter.format(totalPrice - discountAmount)}{" "}
              {discountAmount > 0 && (
                <Text delete>{currencyFormatter.format(totalPrice)}</Text>
              )}{" "}
              | {totalDuration}hrs
            </Title>
          </div>
          <Popover
            content={
              <Text className="whitespace-pre">{_package?.includes}</Text>
            }
            title={_package?.displayName}
          >
            <Button
              className="!absolute top-0 right-0"
              icon={
                <Icon
                  className="!text-2xl [&_svg]:!fill-white"
                  component={InformationCircleIcon}
                />
              }
              type="text"
            />
          </Popover>
        </Flex>
        <Divider />
        {customerAddOns &&
          Object.keys(customerAddOns).map((key) => {
            const addOn = addOns?.find((a) => a.id === +key);
            const isPackageAddOn = _package?.packageAddOns?.find(
              (pa) => pa.addOn?.id === +key,
            );
            const hasQuantity = isPackageAddOn
              ? true
              : customerAddOns[+key] > 0;
            return (
              addOn &&
              hasQuantity && (
                <Flex gap={16} align="center" className="pl-10 mb-2" key={key}>
                  {/*<div>*/}
                  {/*  <Image*/}
                  {/*    src={addOn?.image}*/}
                  {/*    alt={addOn?.name}*/}
                  {/*    width={48}*/}
                  {/*    height={48}*/}
                  {/*    className="rounded-2xl"*/}
                  {/*  />*/}
                  {/*</div>*/}
                  <div className="flex-grow">
                    <Title level={5} className="!mt-0">
                      {addOn?.name}
                    </Title>
                  </div>
                  <div className="w-8 h-8 bg-bodyBG rounded-lg flex items-center justify-center !font-medium">
                    {customerAddOns[+key]}
                  </div>
                </Flex>
              )
            );
          })}
        <Divider />
        <Flex gap={8} className="mb-4" align="center">
          <ClockCircleOutlined className="text-xl" />
          <Title level={5} className="!m-0">
            {dayjs(timeslot?.date, "YYYY-MM-DD").format("dddd, DD MMMM YYYY")}{" "}
            at {dayjs(timeslot?.timeslot?.time, "HH:mm").format("hh:mm A")}
          </Title>
        </Flex>
        <Flex gap={8} className="mb-4" align="center">
          <PushpinOutlined className="text-xl" />
          <Title level={5} className="!m-0">
            {customer?.address}
          </Title>
        </Flex>
      </Card>
    </div>
  );
};

export default GetStartedSummary;
