"use client";
import React, { useMemo, useState } from "react";
import { usePackages } from "@/hooks/package.hooks";
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
import { IPackageAddOn, packageCrud } from "@/utils/crud/package.crud";

const Packages = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { packages, loading, refetch } = usePackages({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Package",
      content: "Are you sure you want to delete this package?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          packageCrud
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
        title: "Price",
        dataIndex: "price",
        render: (price: number) => currencyFormatter.format(price),
      },
      {
        title: "AddOns",
        dataIndex: "packageAddOns",
        render: (packageAddOns: IPackageAddOn[]) => packageAddOns?.length,
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
                    <Link href={`/admin/packages/edit/${record.id}`}>Edit</Link>
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
        title="Packages"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search Packages"
            />
            <Link href={"/admin/packages/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add Package
              </Button>
            </Link>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={packages}
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

export default Packages;
