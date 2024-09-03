import React, { useState } from "react";
import { Checkbox, Flex, Form, Input, message, Modal, Radio, Tabs } from "antd";
import { useForm, useWatch } from "antd/lib/form/Form";
import MaskedInputWrapper from "../input/MaskedInputWrapper";
import AgentPlaygroundConversation from "./AgentPlayground.Conversation";
import { IAgent } from "@/utils/crud/agent.crud";
import { smsCrud } from "@/utils/crud/sms.crud";
import { getErrorMsg } from "@/utils/helpers";
import FormItem from "antd/es/form/FormItem";
import { IConversation } from "@/components/sms/SMS.Dashboard";

const AgentPlayground = ({
  playground,
  onCancel,
}: {
  playground: IAgent;
  onCancel: (value: any) => void;
}) => {
  const [form] = useForm();
  const mode = useWatch("mode", form);
  const [conversation, setConversation] = useState<IConversation>();
  const [active, setActive] = useState("1");
  const [loading, setLoading] = useState(false);

  const onFinishDetails = (values: any) => {
    setLoading(true);
    if (mode === "sms") {
      delete values.mode;
      smsCrud
        .createTestConversation({
          ...values,
          agentId: playground.id,
        })
        .then((res) => {
          setLoading(false);
          setConversation(res.data.data);
          message.success("Conversation started successfully");
          setActive("2");
        })
        .catch((err) => {
          setLoading(false);
          message.error(getErrorMsg(err));
        });
    } else {
      // delete values.mode;
      // sendEmailToTest({ ...values, agentId: playground.id })
      //   .then(() => {
      //     message.success(`Email sent successfully!`);
      //     setLoading(false);
      //     form.resetFields();
      //   })
      //   .catch((err) => {
      //     message.error(getErrorMsg(err));
      //     setLoading(false);
      //   });
    }
  };
  const handleChangeTab = (key: string) => {
    if (mode === "email") {
      return;
    }
    setActive(key);
  };
  return (
    <Modal
      open={!!playground}
      onCancel={onCancel}
      okButtonProps={{
        size: "large",
        className: "!px-6",
        loading,
      }}
      okText={active === "1" ? (mode === "email" ? "Send" : "Next") : "Done"}
      cancelButtonProps={{
        size: "large",
        className: "!px-6",
      }}
      {...(active === "2" ? { footer: null } : {})}
      onOk={active === "1" ? form.submit : onCancel}
      width={active === "1" ? 600 : 700}
    >
      <Tabs
        activeKey={active}
        onChange={handleChangeTab}
        destroyInactiveTabPane
        items={[
          {
            key: "1",
            label: "Details",
            children: (
              <Form
                form={form}
                layout="vertical"
                initialValues={{ mode: "sms" }}
                onFinish={onFinishDetails}
              >
                <FormItem
                  label="Playground mode"
                  name="mode"
                  rules={[
                    {
                      required: true,
                      message: "Please select mode!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="sms">SMS</Radio>
                    <Radio value="email">Email</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input name!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter name" />
                </FormItem>
                <FormItem
                  name={"vehicleName"}
                  label="Vehicle"
                  rules={[
                    {
                      required: true,
                      message: "Please input the name of vehicle!",
                      pattern: new RegExp(
                        /^[0-9]{4}\s*\/\s*[a-zA-Z0-9\s]+\s*\/\s*[a-zA-Z0-9\s]+$/,
                      ),
                    },
                  ]}
                >
                  <Input size="large" placeholder="Year / Make / Model" />
                </FormItem>

                {mode === "sms" ? (
                  <FormItem
                    label="Phone"
                    name="contact"
                    rules={[
                      {
                        required: true,
                        message: "Please input phone!",
                      },
                    ]}
                  >
                    <MaskedInputWrapper
                      mask={[{ mask: "(000) 000-0000" }]}
                      placeholder="Enter phone"
                      size="large"
                    />
                  </FormItem>
                ) : (
                  <FormItem
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input email!",
                        type: "email",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter email" />
                  </FormItem>
                )}
                {mode === "email" && (
                  <Flex align="center">
                    <FormItem name="withHeaderLogo" valuePropName="checked">
                      <Checkbox>With Header Logo</Checkbox>
                    </FormItem>
                    <FormItem name="withFooter" valuePropName="checked">
                      <Checkbox>With Footer Logo</Checkbox>
                    </FormItem>
                  </Flex>
                )}
              </Form>
            ),
          },
          {
            key: "2",
            label: "Conversation",
            children: (
              <AgentPlaygroundConversation
                conversation={conversation as IConversation}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default AgentPlayground;
