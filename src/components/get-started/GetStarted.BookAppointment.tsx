import React, { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Button, Checkbox, Col, Form, Input, message, Row } from "antd";
import { FormItem, Text } from "@/components/antd-sub-components";
import MaskedInputWrapper from "@/components/input/MaskedInputWrapper";
import { customerCrud, ICustomer } from "@/utils/crud/customer.crud";
import AddressFormInput from "@/components/input/AddressFormInput";
import { PreferencesTypes } from "@/utils/enums";
import { customerServiceCrud } from "@/utils/crud/customerService.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { IService } from "@/utils/crud/service.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { getErrorMsg } from "@/utils/helpers";

const GetStartedBookAppointment = ({
  next,
  customer,
  setCustomer,
}: {
  next: () => void;
  customer: ICustomer | null;
  setCustomer: (customer: ICustomer) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const form = Form.useFormInstance();
  const [form1] = useForm();
  const _package: IPackage = Form.useWatch("package", form);
  const service: IService = Form.useWatch("service", form);
  const vehicle: IVehicle = Form.useWatch("vehicle", form);
  const timeslot = Form.useWatch("timeslot", form);
  const customerAddOns: {
    [key: number]: number;
  } = Form.useWatch("customerAddOns", form);
  const onFinish = (values: any) => {
    setLoading(true);
    customerCrud[step === 0 ? "create" : "update"]({
      ...values,
      ...(step === 1
        ? {
            id: customer?.id,
            preferences: {
              ...values.preferences,
              type: PreferencesTypes.SMS,
            },
          }
        : {}),
    })
      .then((res) => {
        setLoading(false);
        setCustomer(res.data.data);
        customerServiceCrud.create({
          customer: res.data.data?.id,
          service: service?.id,
          vehicle: vehicle?.id,
          package: _package?.id,
          customerAddOns: customerAddOns,
          timeslot: { ...timeslot, timeslot: timeslot.timeslot?.id },
        });
        if (step === 0) {
          setStep(1);
          return;
        }
        next();
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <Form
      form={form1}
      component="div"
      onFinish={onFinish}
      layout="vertical"
      size="small"
    >
      <Row gutter={[8, 0]}>
        {step === 0 ? (
          <>
            <Col xs={24} sm={12}>
              <FormItem
                name="firstName"
                label="First name"
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
                label="Last name"
                rules={[
                  { required: true, message: "Please input your last name" },
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
                  { required: true, message: "Please input your email" },
                  { type: "email", message: "Please input a valid email" },
                ]}
              >
                <Input size="large" placeholder="johnsmith@gmail.com" />
              </FormItem>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24}>
              <FormItem name="city" hidden />
              <FormItem name="state" hidden />
              <FormItem name="zipCode" hidden />
              <FormItem name="country" hidden />
              <FormItem
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please input your address" },
                ]}
              >
                <AddressFormInput />
              </FormItem>
            </Col>
            <Col xs={24}>
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
              <FormItem
                name={["preferences", "appointment"]}
                valuePropName="checked"
              >
                <Checkbox>
                  <Text type="secondary" className="!font-normal">
                    I agree to receive SMS updates regarding my appointment
                  </Text>
                </Checkbox>
              </FormItem>
            </Col>
          </>
        )}
        <Col xs={24}>
          <Button
            type="primary"
            htmlType="button"
            block
            onClick={form1.submit}
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
