"use client";
import React, { useMemo, useState } from "react";
import { useAddOns } from "@/hooks/addOns.hooks";
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
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  currencyFormatter,
  dateFormat,
  getErrorMsg,
  showTotal,
} from "@/utils/helpers";
import { Paragraph } from "@/components/antd-sub-components";
import dayjs from "dayjs";
import Link from "next/link";
import { addOnCrud, IAddOn } from "@/utils/crud/addOn.crud";
import { IAddOnCategory } from "@/utils/crud/addOn.category.crud";
import Image from "next/image";

const AddOns = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { addOns, loading, refetch } = useAddOns({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete AddOn",
      content: "Are you sure you want to delete this addOns?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          addOnCrud
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
        title: "Icon",
        render: (data: IAddOn) => (
          <Image
            src={data.image}
            alt={data.name}
            width={40}
            height={40}
            className="rounded"
          />
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Description",
        dataIndex: "description",
        render: (description: string) => (
          <Paragraph ellipsis={{ rows: 2 }} className="!m-0">
            {description || "--"}
          </Paragraph>
        ),
      },
      {
        title: "Duration",
        dataIndex: "duration",
        render: (duration: number) => `${duration} minutes`,
      },
      {
        title: "Category",
        dataIndex: "category",
        render: (category: IAddOnCategory) => category?.name || "--",
      },
      {
        title: "Price",
        dataIndex: "price",
        render: (price: number) => currencyFormatter.format(price),
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
                  key: "edit",
                  label: (
                    <Link href={`/admin/addons/edit/${record.id}`}>Edit</Link>
                  ),
                  icon: <EditOutlined />,
                },
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
  return (
    <>
      <Card
        title="AddOns"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search AddOns"
            />
            <Link href={"/admin/addons/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add AddOn
              </Button>
            </Link>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={addOns}
          columns={columns as TableColumnsType}
          pagination={{
            ...pagination,
            showTotal: showTotal,
          }}
          rowKey="id"
        />
      </Card>
    </>
  );
};

export default AddOns;
