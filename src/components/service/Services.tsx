"use client";
import React, { useMemo, useState } from "react";
import { useServices } from "@/hooks/service.hooks";
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
import { dateFormat, getErrorMsg, showTotal } from "@/utils/helpers";
import { Paragraph } from "@/components/antd-sub-components";
import dayjs from "dayjs";
import Link from "next/link";
import { IService, serviceCrud } from "@/utils/crud/service.crud";
import Image from "next/image";

const Services = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { services, loading, refetch } = useServices({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Service",
      content: "Are you sure you want to delete this service?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          serviceCrud
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
        render: (data: IService) => (
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
        title: "Packages",
        dataIndex: "servicePackages",
        render: (servicePackages: any[]) => servicePackages?.length,
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
                    <Link href={`/admin/services/edit/${record.id}`}>Edit</Link>
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
        title="Services"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search Services"
            />
            <Link href={"/admin/services/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add Service
              </Button>
            </Link>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={services}
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

export default Services;
