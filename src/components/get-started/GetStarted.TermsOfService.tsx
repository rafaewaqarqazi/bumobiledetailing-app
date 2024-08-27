import React, { useState } from "react";
import { FormItem } from "@/components/antd-sub-components";
import { Button, Checkbox, Divider, Form, Modal } from "antd";
import TermsOfServices from "@/components/tos/TermsOfServices";

const GetStartedTermsOfService = () => {
  const form = Form.useFormInstance();
  const [show, setShow] = useState(false);
  const onClick = () => setShow(!show);
  const onCancel = () => setShow(false);

  const onOk = () => {
    form.setFieldsValue({ terms: true });
    setShow(false);
  };
  return (
    <div className="mt-4">
      {show && (
        <Modal
          title="Terms of services"
          open={show}
          onCancel={onCancel}
          onOk={onOk}
          okText="Accept"
          okButtonProps={{
            size: "middle",
          }}
          cancelButtonProps={{
            size: "middle",
          }}
        >
          <TermsOfServices />
          <Divider />
        </Modal>
      )}

      <FormItem
        name="terms"
        valuePropName="checked"
        rules={[
          {
            required: true,
            message:
              "Please read and agree to the BU Mobile Detailing Service Agreement",
          },
          {
            type: "enum",
            enum: [true],
            message:
              "Please read and agree to the BU Mobile Detailing Service Agreement",
          },
        ]}
        className="!-mr-3"
      >
        <Checkbox className="!items-start">
          I have read and agree to the BU Mobile Detailing{" "}
          <Button className="!p-0" type="link" onClick={onClick}>
            Service Agreement
          </Button>
        </Checkbox>
      </FormItem>
    </div>
  );
};

export default GetStartedTermsOfService;
