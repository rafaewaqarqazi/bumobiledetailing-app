"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import { useService } from "@/hooks/service.hooks";
import {
  FormItem,
  Option,
  Paragraph,
  Text,
  TextArea,
} from "@/components/antd-sub-components";
import { useRouter } from "next/navigation";
import { serviceCrud } from "@/utils/crud/service.crud";
import { currencyFormatter, getErrorMsg } from "@/utils/helpers";
import { usePackages } from "@/hooks/package.hooks";
import FormUploadFile from "@/components/input/FormUploadFile";
import { MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { IPackage } from "@/utils/crud/package.crud";
const ServiceForm = () => {
  const { service } = useService();
  const { packages } = usePackages({});
  const [form] = Form.useForm();
  const servicePackages = Form.useWatch("servicePackages", form);
  const isPopular = Form.useWatch("isPopular", form);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        ...service,
        servicePackages: service.servicePackages?.map((sp) => sp.package?.id),
        isPopular: service.servicePackages?.find((sp) => sp.isPopular)?.package
          ?.id,
      });
    }
  }, [service]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (service?.id) {
      values.id = service.id;
    }
    const _isPopular = values.isPopular;
    delete values.isPopular;
    serviceCrud[service?.id ? "update" : "create"]({
      ...values,
      servicePackages: values.servicePackages.map((id: number) => ({
        package: id,
        isPopular: _isPopular === id,
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
  const onClickMakePopular = (id: number) => () => {
    form.setFieldsValue({ isPopular: id });
  };
  return (
    <Card title="Add Service">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="!max-w-3xl !mx-auto"
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
        <FormItem name="isPopular" hidden />
        <Table
          className="mb-4"
          dataSource={
            servicePackages?.map((id: number) =>
              packages?.find((p) => p.id === id),
            ) || []
          }
          columns={[
            {
              title: "Name",
              render: (data: IPackage) => (
                <Flex align="center" wrap="nowrap" gap={8}>
                  <Text>{data.name}</Text>
                  {data.id === isPopular && <Tag color="green">Popular</Tag>}
                </Flex>
              ),
            },
            {
              title: "Display Name",
              dataIndex: "displayName",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (price: number) => currencyFormatter.format(price),
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
              title: "Actions",
              align: "right",
              render: (record) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: "Make Popular",
                        onClick: onClickMakePopular(record.id),
                        disabled: record.id === isPopular,
                      },
                    ],
                  }}
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              ),
            },
          ]}
          pagination={false}
          rowKey="id"
        />
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
