"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import { useAddOn } from "@/hooks/addOns.hooks";
import { FormItem, Option, TextArea } from "@/components/antd-sub-components";
import { useRouter } from "next/navigation";
import { addOnCrud } from "@/utils/crud/addOn.crud";
import { getErrorMsg } from "@/utils/helpers";
import { useAddOnCategories } from "@/hooks/addOn.category.hooks";
import FormUploadFile from "@/components/input/FormUploadFile";
import { UploadOutlined } from "@ant-design/icons";

const AddOnForm = () => {
  const { addOn } = useAddOn();
  const { addOnCategories } = useAddOnCategories({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (addOn) {
      form.setFieldsValue({
        ...addOn,
        category: addOn.category?.id,
      });
    }
  }, [addOn]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (addOn?.id) {
      values.id = addOn.id;
    }
    addOnCrud[addOn?.id ? "update" : "create"](values)
      .then(() => {
        setLoading(false);
        message.success(
          `AddOn ${addOn?.id ? "updated" : "created"} successfully`,
        );
        if (!addOn) {
          router.push("/admin/addons");
        }
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  return (
    <Card title="Add AddOn">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="!max-w-xl !mx-auto"
      >
        <FormItem
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please enter addOn name",
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please enter addOn description",
            },
          ]}
        >
          <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </FormItem>
        <FormItem
          name="category"
          label="AddOn Category"
          rules={[
            {
              required: true,
              message: "Please select addOn category",
            },
          ]}
        >
          <Select>
            {addOnCategories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Please enter addOn price",
            },
          ]}
        >
          <Input type="number" min={0} />
        </FormItem>
        <FormItem
          name="duration"
          label="Duration (minutes)"
          rules={[
            {
              required: true,
              message: "Please enter addOn duration",
            },
          ]}
        >
          <InputNumber className="!w-full" min={0} />
        </FormItem>
        <FormUploadFile
          name="image"
          label="Icon"
          rules={[
            {
              required: true,
              message: "Please upload icon",
            },
          ]}
        >
          <Button icon={<UploadOutlined />} block>
            Click to Upload
          </Button>
        </FormUploadFile>

        <Row justify="end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default AddOnForm;
