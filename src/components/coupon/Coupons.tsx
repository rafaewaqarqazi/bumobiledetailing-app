"use client";
import React, { useMemo, useState } from "react";
import { useCoupons } from "@/hooks/coupon.hooks";
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
import dayjs from "dayjs";
import { couponCrud } from "@/utils/crud/coupon.crud";
import CouponForm from "@/components/coupon/CouponForm";

const Coupons = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);
  const { coupons, loading, refetch } = useCoupons({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickEdit = (id: number) => () => {
    setSelectedCoupon(id);
    setOpen(true);
  };
  const onClickAdd = () => {
    setSelectedCoupon(null);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setSelectedCoupon(null);
  };
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Coupon",
      content: "Are you sure you want to delete this coupon?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          couponCrud
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
        title: "Code",
        dataIndex: "code",
      },
      {
        title: "Discount Amount",
        dataIndex: "discountAmount",
        render: (amount: number) => currencyFormatter.format(amount || 0),
      },
      {
        title: "Discount Percentage",
        dataIndex: "discountPercentage",
        render: (percentage: number) => `${percentage || 0}%`,
      },
      {
        title: "Valid From",
        dataIndex: "startAt",
        render: (date: string) => dayjs(date).format(dateFormat),
      },
      {
        title: "Valid Till",
        dataIndex: "endAt",
        render: (date: string) => dayjs(date).format(dateFormat),
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
                  label: "Edit",
                  icon: <EditOutlined />,
                  onClick: onClickEdit(record.id),
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
        title="Coupons"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search Coupon"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={onClickAdd}>
              Add Coupon
            </Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={coupons}
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
      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          footer={null}
          title={`${selectedCoupon ? "Edit" : "Add"} Coupon`}
        >
          <CouponForm
            id={selectedCoupon as number}
            onClose={onClose}
            refetch={refetch}
          />
        </Modal>
      )}
    </>
  );
};

export default Coupons;
