import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Calendar,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  message,
  Row,
  Spin,
} from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { currencyFormatter, getErrorMsg } from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import { useAddOns } from "@/hooks/addOns.hooks";
import dayjs, { Dayjs } from "dayjs";
import { ITimeslot, timeslotCrud } from "@/utils/crud/timeslot.crud";

const GetStartedTimeslot = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const [value, setValue] = useState<Dayjs>();
  const [selectedValue, setSelectedValue] = useState<Dayjs>();
  const [loading, setLoading] = useState(false);
  const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);
  useEffect(() => {
    if (selectedValue) {
      setLoading(true);
      timeslotCrud
        .getByDate(dayjs(selectedValue).format("YYYY-MM-DD"))
        .then((res) => {
          setLoading(false);
          setTimeslots(res.data.data);
        })
        .catch((err) => {
          setLoading(false);
          message.error(getErrorMsg(err));
        });
    }
  }, [selectedValue]);
  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };
  const _package: IPackage = Form.useWatch("package", form);
  const customerAddOns: {
    [key: number]: number;
  } = Form.useWatch("customerAddOns", form);

  const { addOns } = useAddOns({});
  const totalPrice = useMemo(() => {
    let total = Number(_package?.price || 0);
    Object.keys(customerAddOns || {}).forEach((key) => {
      const addOn = addOns?.find((a) => a.id === +key);
      if (
        _package?.packageAddOns?.some((pAddOn) => pAddOn.addOn?.id === +key)
      ) {
        if (Number(customerAddOns[+key] || 0) > 1) {
          total +=
            Number(addOn?.price || 0) * (Number(customerAddOns[+key] || 0) - 1);
        }
      } else {
        total += Number(addOn?.price || 0) * Number(customerAddOns[+key] || 0);
      }
    });
    return total;
  }, [customerAddOns, _package, addOns]);
  const onClickTimeslot = (timeslot: ITimeslot) => () => {
    form.setFieldValue("timeslot", timeslot);
    // next();
  };
  return (
    _package && (
      <div className="mt-4">
        <Card className="!p-1">
          <Flex gap={16} align="center">
            <div>
              <Image
                src={_package?.image}
                alt={_package?.name}
                width={120}
                height={120}
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
                {currencyFormatter.format(_package?.price)}
              </Title>
            </div>
          </Flex>
        </Card>
        <Calendar
          value={value}
          onSelect={onSelect}
          disabledDate={(current) => current < dayjs().subtract(1, "day")}
          onPanelChange={onPanelChange}
          fullscreen={false}
          className="!mt-4"
        />
        <Divider />
        <Row gutter={[16, 16]} className="!min-h-20">
          {loading ? (
            <div className="flex items-center justify-center h-20 w-full">
              <Spin />
            </div>
          ) : !loading && timeslots?.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="no timeslot available"
              />
            </div>
          ) : (
            timeslots.map((timeslot) => (
              <Col xs={24} sm={6} key={timeslot.id}>
                <Card
                  className="!p-1 hover:border-primary cursor-pointer group"
                  onClick={onClickTimeslot(timeslot)}
                >
                  <Title level={5} className="!mt-0 !mb-0 text-center">
                    {timeslot.time}
                  </Title>
                </Card>
              </Col>
            ))
          )}
        </Row>
        <Button
          type="primary"
          className="!mt-4"
          block
          size="large"
          onClick={next}
        >
          Pay Total {currencyFormatter.format(totalPrice)}
        </Button>
      </div>
    )
  );
};

export default GetStartedTimeslot;
