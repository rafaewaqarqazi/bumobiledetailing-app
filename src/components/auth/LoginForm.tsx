"use client";
import React, { useState } from "react";
import { FormItem, Title } from "@/components/antd-sub-components";
import { Button, Card, Checkbox, Form, Input, message, Space } from "antd";
import Link from "next/link";
import { useForm } from "antd/es/form/Form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = ({
  userType,
}: {
  userType: "admin" | "customer" | "employee";
}) => {
  const [form] = useForm();
  const router = useRouter();
  const isAdmin = userType === "admin";
  const isEmployee = userType === "employee";
  const [loading, setLoading] = useState(false);
  const onFinish = (values: any) => {
    setLoading(true);
    signIn("credentials", {
      ...values,
      userType: userType,
      redirect: false,
    }).then((res) => {
      console.log(res);
      setLoading(false);
      if (res?.ok) {
        message.success("login successful");
        router.push("/");
      }
      if (res?.error) {
        message.error(res.error);
      }
    });
  };
  return (
    <Card bordered={false} className="w-full !shadow-2xl rounded-2xl p-4 ">
      <Title level={3} className="text-center !font-extrabold !mt-0">
        Login to BU Mobile Detailing
      </Title>
      <Form
        form={form}
        initialValues={{
          remember: false,
        }}
        id="loginForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <FormItem
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input valid email!",
              type: "email",
            },
          ]}
        >
          <Input placeholder="Email" size="large" />
        </FormItem>
        <FormItem
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" size="large" />
        </FormItem>
        <Space className="w-full justify-between">
          <FormItem
            name="remember"
            valuePropName="checked"
            className="mt-0 mb-0"
          >
            <Checkbox>Remember me</Checkbox>
          </FormItem>
          <FormItem className="mb-0">
            <Link
              href={`/auth/forgot-password${isAdmin ? "?a=true" : isEmployee ? "?e=true" : ""}`}
              className="text-xs"
            >
              forgot password?
            </Link>
          </FormItem>
        </Space>

        {userType === "customer" && (
          <FormItem className="mt-0 mb-4">
            <Link href={`/auth/signup`} className="text-xs">
              {`Don't`} have an account?
            </Link>
          </FormItem>
        )}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          size="large"
        >
          Login
        </Button>
      </Form>
    </Card>
  );
};

export default LoginForm;
