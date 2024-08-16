"use client";
import React, { useState } from "react";
import { Button, Card, Form, Input, message, Row, Typography } from "antd";
import Link from "next/link";
import { useForm } from "antd/lib/form/Form";
import { useRouter, useSearchParams } from "next/navigation";
import { getErrorMsg } from "@/utils/helpers";
import { forgotPassword } from "@/utils/crud/auth.crud";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = useForm();
  const isAdmin = searchParams.get("a") === "true";
  const isEmployee = searchParams.get("e") === "true";
  const onFinish = (data: any) => {
    setLoading(true);
    forgotPassword({ ...data, isAdmin, isEmployee })
      .then(() => {
        message.success(
          "We have sent you a password reset email. If you do not receive it, please check your spam or junk folders.",
        );
        setLoading(false);
        setTimeout(() => {
          router.push(
            `/auth/login${isAdmin ? "-admin" : isEmployee ? "-employee" : ""}`,
          );
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
        Forgot Password
      </Typography.Title>
      <Typography.Title
        level={5}
        type="secondary"
        style={{ maxWidth: 350, margin: "0 auto" }}
      >
        Enter your email to reset your password
      </Typography.Title>
      <Form
        form={form}
        name="forgot-password-form"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input valid email!",
            },
          ]}
        >
          <Input placeholder="Enter your email address" size="large" />
        </Form.Item>
        <Button
          loading={loading}
          block
          size="large"
          type="primary"
          htmlType="submit"
        >
          Reset Password
        </Button>

        <Row justify="center" style={{ marginTop: 10 }}>
          <Link
            href={`/auth/login${isAdmin ? "-admin" : isEmployee ? "-employee" : ""}`}
          >
            <Typography.Text type="secondary" strong>
              {"<<"} Back to login
            </Typography.Text>
          </Link>
        </Row>
      </Form>
    </Card>
  );
};

export default ForgotPassword;
