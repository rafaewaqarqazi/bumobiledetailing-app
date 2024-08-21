"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Row, Select } from "antd";
import { useService } from "@/hooks/service.hooks";
import { FormItem, Option, TextArea } from "@/components/antd-sub-components";
import { useRouter } from "next/navigation";
import { serviceCrud } from "@/utils/crud/service.crud";
import { getErrorMsg } from "@/utils/helpers";
import { usePackages } from "@/hooks/package.hooks";
import FormUploadFile from "@/components/input/FormUploadFile";
import { UploadOutlined } from "@ant-design/icons";
const ServiceForm = () => {
  const { service } = useService();
  const { packages } = usePackages({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        ...service,
        servicePackages: service.servicePackages?.map((sp) => sp.package?.id),
      });
    }
  }, [service]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (service?.id) {
      values.id = service.id;
    }
    serviceCrud[service?.id ? "update" : "create"]({
      ...values,
      servicePackages: values.servicePackages.map((id: number) => ({
        package: id,
      })),
    })
      .then(() => {
        setLoading(false);
        message.success(
          `Service ${service?.id ? "updated" : "created"} successfully`,
        );
        if (!service) {
          router.push("/admin/services");
        }
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  return (
    <Card title="Add Service">
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
              message: "Please enter service name",
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
              message: "Please enter service description",
            },
          ]}
        >
          <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </FormItem>
        <FormItem
          label="Packages"
          name="servicePackages"
          rules={[{ required: true, message: "Please select packages" }]}
        >
          <Select mode="multiple" placeholder="Select packages">
            {packages?.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.name}
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

export default ServiceForm;
