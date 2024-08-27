"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Row } from "antd";
import { FormItem, RangePicker } from "@/components/antd-sub-components";
import { getErrorMsg } from "@/utils/helpers";
import { useCoupon } from "@/hooks/coupon.hooks";
import { IHooksList } from "@/hooks";
import { couponCrud } from "@/utils/crud/coupon.crud";
import dayjs from "dayjs";
const CouponForm = ({
  id,
  onClose,
  refetch,
}: {
  id?: number;
  onClose: () => void;
  refetch: (data: Partial<IHooksList>) => void;
}) => {
  const { coupon } = useCoupon(id);
  const [form] = Form.useForm();
  const fromDate = Form.useWatch("startAt", form);
  const toDate = Form.useWatch("endAt", form);
  const discountAmount = Form.useWatch("discountAmount", form);
  const discountPercentage = Form.useWatch("discountPercentage", form);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (coupon) {
      form.setFieldsValue({
        ...coupon,
        startAt: dayjs(coupon.startAt),
        endAt: dayjs(coupon.endAt),
      });
    }
  }, [coupon]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (id) {
      values.id = id;
    }
    couponCrud[id ? "update" : "create"](values)
      .then(() => {
        setLoading(false);
        message.success(
          `Coupon ${coupon?.id ? "updated" : "created"} successfully`,
        );
        refetch({ current: 1, pageSize: 10 });
        onClose();
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  const onChangeRange = (dates: any) => {
    form.setFieldsValue({
      startAt: dates[0],
      endAt: dates[1],
    });
  };
  const onValuesChange = (changedValues: any) => {
    if (changedValues.discountAmount) {
      form.setFieldsValue({ discountPercentage: null });
    }
    if (changedValues.discountPercentage) {
      form.setFieldsValue({ discountAmount: null });
    }
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="!max-w-xl !mx-auto"
      onValuesChange={onValuesChange}
    >
      <FormItem
        label="Code"
        name="code"
        rules={[{ required: true, message: "Please enter code" }]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Discount Amount"
        name="discountAmount"
        rules={[
          {
            required: !discountPercentage,
            message: "Please enter discount amount",
          },
        ]}
      >
        <Input type="number" min={0} />
      </FormItem>
      <FormItem
        label="Discount Percentage"
        name="discountPercentage"
        rules={[
          {
            required: !discountAmount,
            message: "Please enter discount percentage",
          },
        ]}
      >
        <Input type="number" min={0} max={100} />
      </FormItem>
      <FormItem
        name="startAt"
        rules={[{ required: true, message: "Please enter start date" }]}
        className="hidden"
      />

      <FormItem
        name="endAt"
        rules={[{ required: true, message: "Please enter end date" }]}
        className="hidden"
      />
      <label className="block mb-2">Select Range</label>
      <RangePicker
        className="w-full !mb-4"
        value={[fromDate, toDate]}
        format="YYYY-MM-DD"
        onChange={onChangeRange}
      />

      <Row justify="end">
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default CouponForm;
