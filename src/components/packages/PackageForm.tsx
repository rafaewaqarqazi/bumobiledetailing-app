"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Input, message, Row, Table } from "antd";
import { usePackage } from "@/hooks/package.hooks";
import { FormItem, TextArea } from "@/components/antd-sub-components";
import { useAddOns } from "@/hooks/addOns.hooks";
import { IPackageAddOn, packageCrud } from "@/utils/crud/package.crud";
import { useRouter } from "next/navigation";
import { getErrorMsg } from "@/utils/helpers";
import FormUploadFile from "@/components/input/FormUploadFile";
import { UploadOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
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
import PackageFormAddOns from "@/components/packages/PackageFormAddOns";
import DragAbleTableRow from "@/components/dnd/DragAbleTableRow";

const PackageForm = () => {
  const { packageData } = usePackage();
  const { addOns } = useAddOns({});
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const packageAddOns: IPackageAddOn[] = Form.useWatch("packageAddOns", form);
  useEffect(() => {
    if (packageData) {
      form.setFieldsValue({
        ...packageData,
        packageAddOns: packageData.packageAddOns?.map((addOn) => ({
          id: addOn.addOn.id,
          rank: addOn.rank,
        })),
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
      packageAddOns: values.packageAddOns.map((p: IPackageAddOn) => ({
        addOn: p.id,
        rank: p.rank,
      })),
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = packageAddOns.findIndex((i) => i.id === active.id);
      const overIndex = packageAddOns.findIndex((i) => i.id === over?.id);
      const newPackageAddOns = arrayMove(packageAddOns, activeIndex, overIndex);
      form.setFieldValue(
        "packageAddOns",
        newPackageAddOns.map((p, i) => ({ ...p, rank: i })),
      );
    }
  };
  const dataSource = useMemo(
    () =>
      (
        packageAddOns?.map((p: IPackageAddOn) => ({
          ...p,
          ...addOns?.find((a) => a.id === p.id),
        })) || []
      ).sort((a: IPackageAddOn, b: IPackageAddOn) => a.rank - b.rank),
    [packageAddOns, addOns],
  );
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
          name="displayName"
          label="Display Name"
          rules={[
            {
              required: true,
              message: "Please enter package display name",
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
          <PackageFormAddOns addOns={addOns} />
        </FormItem>
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
              columns={[
                {
                  title: "Order",
                  dataIndex: "rank",
                },
                {
                  title: "Name",
                  dataIndex: "name",
                },
              ]}
              rowKey={(record) => record?.id}
              dataSource={dataSource}
              pagination={false}
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

export default PackageForm;
