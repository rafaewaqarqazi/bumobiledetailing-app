import React, { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { FormItem } from "@/components/antd-sub-components";
import MaskedInputWrapper from "@/components/input/MaskedInputWrapper";
import { customerCrud, ICustomer } from "@/utils/crud/customer.crud";
import AddressFormInput from "@/components/input/AddressFormInput";
import { PreferencesTypes } from "@/utils/enums";

const GetStartedBookAppointment = ({
  next,
  setCustomer,
}: {
  next: () => void;
  setCustomer: (customer: ICustomer) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const onFinish = (values: any) => {
    setLoading(true);
    customerCrud
      .create({
        ...values,
        preferences: {
          ...values.preferences,
          type: PreferencesTypes.SMS,
        },
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setCustomer(res.data.data);
        next();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <Form form={form} onFinish={onFinish} layout="vertical" size="small">
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <FormItem
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input your first name" },
            ]}
          >
            <Input size="large" placeholder="John" />
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input your last name" }]}
          >
            <Input size="large" placeholder="Smith" />
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please input a valid email" },
            ]}
          >
            <Input size="large" placeholder="johnsmith@gmail.com" />
          </FormItem>
        </Col>
        <Col xs={24} sm={12}>
          <FormItem
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number",
              },
              {
                pattern: /^[0-9]{3} [0-9]{3} [0-9]{4}$/,
                message: "Please input a valid phone number",
              },
            ]}
          >
            <MaskedInputWrapper
              mask="000 000 0000"
              size="large"
              placeholder="Your Phone Number"
            />
          </FormItem>
        </Col>
        <Col xs={24}>
          <FormItem name="city" hidden />
          <FormItem name="state" hidden />
          <FormItem name="zipCode" hidden />
          <FormItem name="country" hidden />
          <FormItem
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input your address" }]}
          >
            <AddressFormInput />
          </FormItem>
        </Col>

        <Col xs={24}>
          <FormItem
            name={["preferences", "appointment"]}
            valuePropName="checked"
          >
            <Checkbox>
              I agree to receive SMS updates regarding my appointment
            </Checkbox>
          </FormItem>
        </Col>
        <Col xs={24}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default GetStartedBookAppointment;
