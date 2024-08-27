"use client";
import React, { useMemo, useState } from "react";
import { useBookings } from "@/hooks/booking.hooks";
import {
  Button,
  Card,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { useInputSearch } from "@/hooks/input.search.hooks";
import {
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  currencyFormatter,
  dateFormat,
  getErrorMsg,
  showTotal,
} from "@/utils/helpers";
import dayjs from "dayjs";
import { bookingCrud } from "@/utils/crud/booking.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { IService } from "@/utils/crud/service.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { ISchedule } from "@/utils/crud/schedule.crud";

const Bookings = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { bookings, loading, refetch } = useBookings({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });

  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Booking",
      content: "Are you sure you want to delete this booking?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          bookingCrud
            .delete(id)
            .then(() => {
              refetch({ ...pagination });
              resolve(true);
            })
            .catch((err) => {
              message.error(getErrorMsg(err));
              reject();
            });
        });
      },
    });
  };
  const columns = useMemo(
    () => [
      {
        title: "First Name",
        dataIndex: "customer",
        render: (customer: ICustomer) => customer.firstName,
      },
      {
        title: "Last Name",
        dataIndex: "customer",
        render: (customer: ICustomer) => customer.lastName,
      },
      {
        title: "Email",
        dataIndex: "customer",
        render: (customer: ICustomer) => customer.email,
      },
      {
        title: "Phone",
        dataIndex: "customer",
        render: (customer: ICustomer) => customer.phone,
      },
      {
        title: "Service",
        dataIndex: "service",
        render: (service: IService) => service.name,
      },
      {
        title: "Package",
        dataIndex: "package",
        render: (_package: IPackage) => _package.name,
      },
      {
        title: "Total Price",
        render: (record: any) =>
          currencyFormatter.format(record.quote?.quotedAmount || 0),
      },
      {
        title: "Timeslot",
        dataIndex: "schedule",
        render: (schedule: ISchedule) =>
          schedule ? `${schedule.date} ${schedule.timeslot.time}` : "--",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (date: string) => dayjs(date).format(dateFormat),
      },
      {
        title: "Actions",
        align: "right",
        render: (record: any) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: "delete",
                  label: "Delete",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: onClickDelete(record.id),
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ],
    [],
  );
  const handleTableChange = (pagination: any) => {
    refetch({
      current: pagination.current,
      pageSize: pagination.pageSize,
      queryString: searchText,
    });
  };
  return (
    <>
      <Card
        title="Bookings"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search booking"
            />
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={bookings}
          columns={columns as TableColumnsType}
          pagination={{
            ...pagination,
            showTotal: showTotal,
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
          rowKey="id"
        />
      </Card>
    </>
  );
};

export default Bookings;
