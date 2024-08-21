"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Row } from "antd";
import { FormItem, TextArea } from "@/components/antd-sub-components";
import { getErrorMsg } from "@/utils/helpers";
import { useAddOnCategory } from "@/hooks/addOn.category.hooks";
import { IHooksList } from "@/hooks";
import { addOnCategoryCrud } from "@/utils/crud/addOn.category.crud";
const AddOnCategoryForm = ({
  id,
  onClose,
  refetch,
}: {
  id?: number;
  onClose: () => void;
  refetch: (data: Partial<IHooksList>) => void;
}) => {
  const { addOnCategory } = useAddOnCategory(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (addOnCategory) {
      form.setFieldsValue(addOnCategory);
    }
  }, [addOnCategory]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (id) {
      values.id = id;
    }
    addOnCategoryCrud[id ? "update" : "create"](values)
      .then(() => {
        setLoading(false);
        message.success(
          `AddOn Category ${addOnCategory?.id ? "updated" : "created"} successfully`,
        );
        refetch({ current: 1, pageSize: 10 });
        onClose();
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="!max-w-xl !mx-auto"
    >
      <FormItem
        name="name"
        label="Name"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input placeholder="Category name" />
      </FormItem>
      <FormItem
        name="description"
        label="Description"
        rules={[{ required: true, message: "Description is required" }]}
      >
        <TextArea
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Description here..."
        />
      </FormItem>

      <Row justify="end">
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default AddOnCategoryForm;
