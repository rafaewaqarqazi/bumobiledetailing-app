import React, { useMemo } from "react";
import { Button, Card, Divider, Flex, Form } from "antd";
import Image from "next/image";
import { Title } from "@/components/antd-sub-components";
import {
  currencyFormatter,
  getTotalDurationByAddOns,
  getTotalPrice,
} from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import { ClockCircleOutlined } from "@ant-design/icons";
import { IAddOn } from "@/utils/crud/addOn.crud";

const GetStartedSummary = ({
  next,
  addOns,
}: {
  next: () => void;
  addOns: IAddOn[];
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
  const totalDuration = useMemo(
    () => getTotalDurationByAddOns({ customerAddOns, addOns }),
    [customerAddOns, addOns],
  );
  return (
    <div>
      <Title level={2} className="!font-semibold !mt-0 !text-4xl">
        Booking Summary
      </Title>
      <Card className="!p-1">
        <Flex gap={16} align="center">
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
              {currencyFormatter.format(totalPrice)} | {totalDuration}hrs
            </Title>
          </div>
        </Flex>
        <Divider />
        {customerAddOns &&
          Object.keys(customerAddOns).map((key) => {
            const addOn = addOns?.find((a) => a.id === +key);
            return (
              addOn && (
                <Flex gap={16} align="center" className="pl-10" key={key}>
                  <div>
                    <Image
                      src={addOn?.image}
                      alt={addOn?.name}
                      width={48}
                      height={48}
                      className="rounded-2xl"
                    />
                  </div>
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

        <Title level={5} className="!mt-0">
          <ClockCircleOutlined /> {timeslot?.date} {timeslot?.timeslot?.time}
        </Title>
      </Card>
      <Button
        type="primary"
        className="!mt-4"
        block
        size="large"
        onClick={next}
      >
        Next
      </Button>
    </div>
  );
};

export default GetStartedSummary;
