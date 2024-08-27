"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Row,
  Table,
  Tag,
} from "antd";
import { useService } from "@/hooks/service.hooks";
import {
  FormItem,
  Paragraph,
  Text,
  TextArea,
} from "@/components/antd-sub-components";
import { useRouter } from "next/navigation";
import { IServicePackage, serviceCrud } from "@/utils/crud/service.crud";
import { currencyFormatter, getErrorMsg } from "@/utils/helpers";
import { usePackages } from "@/hooks/package.hooks";
import FormUploadFile from "@/components/input/FormUploadFile";
import { MoreOutlined, UploadOutlined } from "@ant-design/icons";
import { IPackage } from "@/utils/crud/package.crud";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DragAbleTableRow from "@/components/dnd/DragAbleTableRow";
import ServiceFormPackages from "@/components/service/ServiceFormPackages";
const ServiceForm = () => {
  const { service } = useService();
  const { packages } = usePackages({});
  const [form] = Form.useForm();
  const servicePackages: IServicePackage[] = Form.useWatch(
    "servicePackages",
    form,
  );
  const isPopular = Form.useWatch("isPopular", form);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        ...service,
        servicePackages: service.servicePackages?.map((sp) => ({
          id: sp.package?.id,
          rank: sp.rank,
        })),
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
      servicePackages: values.servicePackages.map((sp: IServicePackage) => ({
        package: sp.id,
        isPopular: _isPopular === sp.id,
        rank: sp.rank,
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = servicePackages.findIndex((i) => i.id === active.id);
      const overIndex = servicePackages.findIndex((i) => i.id === over?.id);
      const newServicePackagesOns = arrayMove(
        servicePackages,
        activeIndex,
        overIndex,
      );
      form.setFieldValue(
        "servicePackages",
        newServicePackagesOns.map((p, i) => ({ ...p, rank: i })),
      );
    }
  };
  const dataSource = useMemo(
    () =>
      (
        servicePackages?.map((sp: IServicePackage) => ({
          ...sp,
          ...packages?.find((p) => p.id === sp.id),
        })) || []
      )?.sort((a: IServicePackage, b: IServicePackage) => a.rank - b.rank),
    [servicePackages, packages],
  );
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
          <ServiceFormPackages packages={packages} />
        </FormItem>
        <FormItem name="isPopular" hidden />
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={dataSource}
            strategy={verticalListSortingStrategy}
          >
            <Table
              className="mb-4"
              dataSource={dataSource}
              columns={[
                {
                  title: "Order",
                  dataIndex: "rank",
                },
                {
                  title: "Name",
                  render: (data: IPackage) => (
                    <Flex align="center" wrap="nowrap" gap={8}>
                      <Text className="whitespace-nowrap">{data.name}</Text>
                      {data.id === isPopular && (
                        <Tag color="green">Popular</Tag>
                      )}
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
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: true }}
                      className="!m-0"
                    >
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
              scroll={{ x: true }}
              components={{
                body: {
                  row: DragAbleTableRow,
                },
              }}
            />
          </SortableContext>
        </DndContext>

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
