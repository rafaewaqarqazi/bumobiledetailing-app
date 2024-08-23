"use client";
import React, { useMemo, useState } from "react";
import { useTimeslots } from "@/hooks/timeslot.hooks";
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
import dayjs from "dayjs";
import { timeslotCrud } from "@/utils/crud/timeslot.crud";
import TimeslotForm from "@/components/timeslot/TimeslotForm";

const Timeslots = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState<number | null>(null);
  const { timeslots, loading, refetch } = useTimeslots({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickEdit = (id: number) => () => {
    setSelectedTimeslot(id);
    setOpen(true);
  };
  const onClickAdd = () => {
    setSelectedTimeslot(null);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setSelectedTimeslot(null);
  };
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete Timeslot",
      content: "Are you sure you want to delete this timeslot?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          timeslotCrud
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
        title: "Time",
        dataIndex: "time",
      },
      {
        title: "Days",
        dataIndex: "days",
        render: (days: string) => days?.split(/,/gm)?.length || 0,
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
        title="Timeslots"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search timeslot"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={onClickAdd}>
              Add Timeslot
            </Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={timeslots}
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
          title={`${selectedTimeslot ? "Edit" : "Add"} Timeslot`}
        >
          <TimeslotForm
            id={selectedTimeslot as number}
            onClose={onClose}
            refetch={refetch}
          />
        </Modal>
      )}
    </>
  );
};

export default Timeslots;
