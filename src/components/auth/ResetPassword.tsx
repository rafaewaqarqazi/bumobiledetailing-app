"use client";
import React, { useState } from "react";
import { Button, Card, Col, Form, Input, message, Row, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/utils/crud/auth.crud";
import { getErrorMsg } from "@/utils/helpers";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = useForm();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onFinish = (data: { newPassword: string }) => {
    setLoading(true);
    resetPassword({ password: data.newPassword }, token as string)
      .then((res) => {
        message.success("Password reset successfully");
        setLoading(false);
        setTimeout(() => {
          router.push(res.data.data.redirectUrl);
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        message.error(getErrorMsg(err));
      });
  };

  return (
    <Card bordered={false} className="w-full !shadow-2xl rounded-2xl p-4 ">
      <Typography.Title level={3} className="!font-extrabold text-center">
        Reset Password
      </Typography.Title>
      <Typography.Title level={5} type="secondary" className="text-center">
        Enter new password
      </Typography.Title>
      <Form
        form={form}
        name="reset-password-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true, message: "Required!" }]}
        >
          <Input.Password autoComplete="new-password" size="large" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Required!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!"),
                );
              },
            }),
          ]}
        >
          <Input.Password autoComplete="off" size="large" />
        </Form.Item>
        <Button
          loading={loading}
          block
          type="primary"
          htmlType="submit"
          size="large"
        >
          Reset Now
        </Button>
      </Form>
    </Card>
  );
};

export default ResetPassword;
