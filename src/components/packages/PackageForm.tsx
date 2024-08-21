"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Row, Select } from "antd";
import { usePackage } from "@/hooks/package.hooks";
import { FormItem, Option, TextArea } from "@/components/antd-sub-components";
import { useAddOns } from "@/hooks/addOns.hooks";
import { packageCrud } from "@/utils/crud/package.crud";
import { useRouter } from "next/navigation";
import { getErrorMsg } from "@/utils/helpers";
import FormUploadFile from "@/components/input/FormUploadFile";
import { UploadOutlined } from "@ant-design/icons";

const PackageForm = () => {
  const { packageData } = usePackage();
  const { addOns } = useAddOns({});
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (packageData) {
      form.setFieldsValue({
        ...packageData,
        packageAddOns: packageData.packageAddOns?.map(
          (addOn) => addOn.addOn?.id,
        ),
      });
    }
  }, [packageData]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (packageData?.id) {
      values.id = packageData.id;
    }
    packageCrud[packageData?.id ? "update" : "create"]({
      ...values,
      packageAddOns: values.packageAddOns.map((id: number) => ({ addOn: id })),
    })
      .then(() => {
        setLoading(false);
        message.success(
          `Package ${packageData?.id ? "updated" : "created"} successfully`,
        );
        if (!packageData) {
          router.push("/admin/packages");
        }
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  return (
    <Card title="Add Package">
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
              message: "Please enter package name",
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
              message: "Please enter package description",
            },
          ]}
        >
          <TextArea
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </FormItem>
        <FormItem
          name="price"
          label="Price"
          rules={[
            {
              required: true,
              message: "Please enter package price",
            },
          ]}
        >
          <Input type="number" min={0} />
        </FormItem>

        <FormItem
          name="packageAddOns"
          label="AddOns"
          rules={[
            {
              required: true,
              message: "Please select package addOns",
              type: "array",
            },
          ]}
        >
          <Select mode="multiple">
            {addOns.map((addOn) => (
              <Option key={addOn.id} value={addOn.id}>
                {addOn.name}
              </Option>
            ))}
          </Select>
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

export default PackageForm;
