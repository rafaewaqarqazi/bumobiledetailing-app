"use client";
import React, { useMemo, useState } from "react";
import { useAddOnCategories } from "@/hooks/addOn.category.hooks";
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
import { addOnCategoryCrud } from "@/utils/crud/addOn.category.crud";
import AddOnCategoryForm from "@/components/addOn/AddOnCategoryForm";

const AddOnCategories = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedAddOnCategory, setSelectedAddOnCategory] = useState<
    number | null
  >(null);
  const { addOnCategories, loading, refetch } = useAddOnCategories({
    ...pagination,
    setPagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const onClickEdit = (id: number) => () => {
    setSelectedAddOnCategory(id);
    setOpen(true);
  };
  const onClickAdd = () => {
    setSelectedAddOnCategory(null);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setSelectedAddOnCategory(null);
  };
  const onClickDelete = (id: number) => () => {
    Modal.confirm({
      title: "Delete AddOn Category",
      content: "Are you sure you want to delete this addOn category?",
      onOk: () => {
        return new Promise((resolve, reject) => {
          addOnCategoryCrud
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
  return (
    <>
      <Card
        title="AddOn Categories"
        extra={
          <Space wrap>
            <Input
              value={searchText}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearch}
              placeholder="Search Categories"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={onClickAdd}>
              Add AddOn Category
            </Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={addOnCategories}
          columns={columns as TableColumnsType}
          pagination={{
            ...pagination,
            showTotal: showTotal,
          }}
          scroll={{ x: true }}
          rowKey="id"
        />
      </Card>
      {open && (
        <Modal
          open={open}
          onCancel={onClose}
          footer={null}
          title={`${selectedAddOnCategory ? "Edit" : "Add"} AddOn Category`}
        >
          <AddOnCategoryForm
            id={selectedAddOnCategory as number}
            onClose={onClose}
            refetch={refetch}
          />
        </Modal>
      )}
    </>
  );
};

export default AddOnCategories;
