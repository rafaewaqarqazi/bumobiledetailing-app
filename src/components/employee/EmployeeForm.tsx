"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Form, Input, message, Row } from "antd";
import { useEmployee } from "@/hooks/employee.hooks";
import { FormItem } from "@/components/antd-sub-components";
import { employeeCrud } from "@/utils/crud/employee.crud";
import { useRouter } from "next/navigation";
import { getErrorMsg } from "@/utils/helpers";
import MaskedInputWrapper from "@/components/input/MaskedInputWrapper";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const EmployeeForm = () => {
  const { employee } = useEmployee();
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
      });
    }
  }, [employee]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (employee?.id) {
      values.id = employee.id;
    }
    employeeCrud[employee?.id ? "update" : "create"](values)
      .then(() => {
        setLoading(false);
        message.success(
          `Employee ${employee?.id ? "updated" : "created"} successfully`,
        );
        if (!employee) {
          router.push("/admin/employees");
        }
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  const handleGeneratePassword = (event: CheckboxChangeEvent) => {
    if (event.target.checked) {
      const password = Math.random().toString(36).slice(2);
      const field = employee?.id ? "newPassword" : "password";
      form.setFieldsValue({ [field]: password });
    }
  };
  return (
    <Card title="Add Employee">
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="!max-w-xl !mx-auto"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <FormItem
              name="firstName"
              label="First name"
              rules={[
                {
                  required: true,
                  message: "Please enter employee first name",
                },
              ]}
            >
              <Input size="large" placeholder="John" />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem
              name="lastName"
              label="Last name"
              rules={[
                {
                  required: true,
                  message: "Please enter employee last name",
                },
              ]}
            >
              <Input size="large" placeholder="Smith" />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter employee email",
                  type: "email",
                },
              ]}
            >
              <Input size="large" placeholder="johnsmith@gmail.com" />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={"Password"}
              name={employee?.id ? "newPassword" : "password"}
              rules={[
                {
                  required: !employee?.id,
                  message: "Please input password!",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input.Password
                autoComplete="new-password"
                size="large"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox onChange={handleGeneratePassword}>
                Auto Generate
              </Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: "Please enter employee phone number",
                },
                {
                  pattern: /^[0-9]{3} [0-9]{3} [0-9]{4}$/,
                  message: "Please input a valid phone number",
                },
              ]}
            >
              <MaskedInputWrapper
                mask="000 000 0000"
                placeholder="(123) 456-7890"
                size="large"
                autoComplete="new-password"
              />
            </FormItem>
          </Col>
          <Col xs={24}>
            <FormItem
              name="position"
              label="Position"
              rules={[
                {
                  required: true,
                  message: "Please enter employee position",
                },
              ]}
            >
              <Input size="large" placeholder="Employee Position" />
            </FormItem>
          </Col>
        </Row>

        <Row justify="end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default EmployeeForm;
