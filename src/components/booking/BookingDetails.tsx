"use client";
import React, { useMemo } from "react";
import {
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
} from "antd";
import { useBooking } from "@/hooks/booking.hooks";
import Image from "next/image";
import { Paragraph, Title } from "@/components/antd-sub-components";
import {
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  currencyFormatter,
  getErrorMsg,
  Statuses,
  StatusesText,
} from "@/utils/helpers";
import { useEmployees } from "@/hooks/employee.hooks";
import dayjs from "dayjs";
import { bookingCrud, IBooking } from "@/utils/crud/booking.crud";
const BookingDetails = () => {
  const { booking, loading, setBooking } = useBooking();
  const { employees } = useEmployees({});
  const totalDuration = useMemo(() => {
    let total = 0;
    booking?.customerAddOns?.forEach((addOn) => {
      total += addOn.addOn.duration * addOn.quantity;
    });
    return total;
  }, [booking?.customerAddOns]);
  const onChangeEmployee = (value: number) => {
    Modal.confirm({
      title: "Assign Employee",
      content: `Are you sure you want to assign this booking to this employee?`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          bookingCrud
            .assignEmployee(booking?.id as number, { employee: value })
            .then(() => {
              message.success("Employee assigned successfully");
              resolve(true);
            })
            .catch((error) => {
              message.error(getErrorMsg(error));
              reject();
            });
        });
      },
    });
  };
  const onChangeStatus = (value: number) => {
    Modal.confirm({
      title: "Change Status",
      content: `Are you sure you want to change the status of this booking?`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          bookingCrud
            .updateStatus(booking?.id as number, value)
            .then(() => {
              message.success("Status changed successfully");
              setBooking((prevState) => ({
                ...((prevState || {}) as IBooking),
                statusId: value,
              }));
              resolve(true);
            })
            .catch((error) => {
              message.error(getErrorMsg(error));
              reject();
            });
        });
      },
    });
  };
  return (
    <Card title="Booking Details">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <Card title="Booking Information">
            {loading ? (
              <Skeleton active />
            ) : !booking ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <>
                <Title level={5} className="!m-0">
                  <UserOutlined /> {booking?.customer?.firstName}{" "}
                  {booking?.customer?.lastName}
                </Title>
                <Flex gap={8} className="mb-2" align="center">
                  <PushpinOutlined />
                  <Paragraph className="!m-0" type="secondary">
                    {booking?.customer?.address}
                  </Paragraph>
                </Flex>
                <Paragraph className="!m-0" type="secondary">
                  <MailOutlined className="mr-1" /> {booking?.customer?.email}
                  <Divider type="vertical" className="!border-primary" />
                  <PhoneOutlined className="mr-1" />
                  {booking?.customer?.phone}
                </Paragraph>

                <Flex gap={16} className="my-4" wrap="wrap">
                  <Flex gap={8} align="center">
                    <Image
                      src={booking?.service?.image}
                      alt={booking?.service?.name}
                      width={36}
                      height={36}
                    />
                    <Title level={5} className="!m-0 !font-bold">
                      {booking?.service?.name}
                    </Title>
                  </Flex>
                  <Flex gap={8} align="center">
                    <Image
                      src={booking?.package?.image}
                      alt={booking?.package?.name}
                      width={36}
                      height={36}
                    />
                    <Title level={5} className="!m-0 !font-bold">
                      {booking?.package?.name} ({booking?.package?.displayName})
                      | {totalDuration}hrs
                    </Title>
                  </Flex>
                </Flex>
                <Divider>Add-Ons</Divider>
                {
                  <Flex gap={8} wrap="wrap">
                    {booking?.customerAddOns?.map((addOn) => (
                      <Card key={addOn.id} size="small">
                        <Flex gap={16} align="center">
                          <Image
                            src={addOn.addOn?.image}
                            alt={addOn.addOn?.name}
                            width={36}
                            height={36}
                            className="rounded-2xl"
                          />

                          <Title level={5} className="!m-0 flex-grow">
                            {addOn.addOn?.name}
                          </Title>

                          <div className="w-8 h-8 bg-bodyBG rounded-lg flex items-center justify-center !font-medium">
                            {addOn.quantity}
                          </div>
                        </Flex>
                      </Card>
                    ))}
                  </Flex>
                }
              </>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title="Summary">
            {loading ? (
              <Skeleton active />
            ) : !booking ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <>
                <Flex justify="center">
                  <Image
                    src={`/images/vehicle/${booking?.vehicle?.type}.png`}
                    alt={booking?.vehicle?.type || "Vehicle"}
                    width={100}
                    height={100}
                  />
                </Flex>
                <Title level={5} className="!mt-0">
                  {booking?.vehicle?.year} {booking?.vehicle?.make}{" "}
                  {booking?.vehicle?.model}
                </Title>

                <Flex gap={8} className="mb-4" align="center">
                  <ClockCircleOutlined className="text-xl" />
                  <Paragraph className="!m-0" type="secondary">
                    {booking?.schedule?.date} |{" "}
                    {dayjs(booking?.schedule?.timeslot?.time, "HH:mm").format(
                      "hh:mm A",
                    )}
                  </Paragraph>
                </Flex>
                <Flex
                  gap={8}
                  className="mb-4"
                  align="center"
                  justify="space-between"
                >
                  <Paragraph className="!m-0 !font-bold">
                    Total Amount
                  </Paragraph>
                  <Title level={5} className="!m-0 !font-extrabold">
                    {currencyFormatter.format(
                      Number(booking?.quote?.quotedAmount),
                    )}
                  </Title>
                </Flex>
                <Flex
                  gap={8}
                  className="mb-4"
                  align="center"
                  justify="space-between"
                >
                  <Paragraph className="!m-0 !font-bold">Status</Paragraph>
                  <Select
                    value={booking?.statusId}
                    className="w-32"
                    onChange={onChangeStatus}
                  >
                    {Object.keys(Statuses)
                      .slice(0, 10)
                      .map((key) => (
                        <Select.Option key={key} value={+key}>
                          {StatusesText[+key as Statuses]}
                        </Select.Option>
                      ))}
                  </Select>
                </Flex>
                <Flex
                  gap={8}
                  className="mb-4"
                  align="center"
                  justify="space-between"
                >
                  <Paragraph className="!m-0 !font-bold">Employee</Paragraph>
                  <Select
                    value={booking?.serviceAssignments?.[0]?.employee?.id}
                    className="w-40"
                    placeholder={"Select Employee"}
                    onChange={onChangeEmployee}
                  >
                    {employees.map((employee) => (
                      <Select.Option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </Select.Option>
                    ))}
                  </Select>
                </Flex>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingDetails;
