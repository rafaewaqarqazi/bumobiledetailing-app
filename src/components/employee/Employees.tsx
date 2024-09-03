"use client";
import React, { useMemo, useState } from "react";
import { useEmployees } from "@/hooks/employee.hooks";
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
  dateFormat,
  formatPhone,
  getErrorMsg,
  showTotal,
} from "@/utils/helpers";
import dayjs from "dayjs";
import { employeeCrud } from "@/utils/crud/employee.crud";
import Link from "next/link";

const Employees = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { employees, loading, refetch } = useEmployees({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });

  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Employee",
      content: "Are you sure you want to delete this employee?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          employeeCrud
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
        dataIndex: "firstName",
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Phone",
        dataIndex: "phone",
        render: (phone: string) => formatPhone(phone),
      },
      {
        title: "Position",
        dataIndex: "position",
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
                    <Link href={`/admin/employees/edit/${record.id}`}>
                      Edit
                    </Link>
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
        title="Employees"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search employee"
            />
            <Link href="/admin/employees/add">
              <Button icon={<PlusOutlined />} type="primary">
                Add Employee
              </Button>
            </Link>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={employees}
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

export default Employees;
