import React, { useEffect, useState } from "react";
import { Button, Empty, Flex, Form, Input, message, Spin } from "antd";

import { SendOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { IConversation } from "@/components/sms/SMS.Dashboard";
import { useSocket } from "@/context/SocketContext";
import { ISMS, smsCrud } from "@/utils/crud/sms.crud";
import { environment } from "@/utils/config";
import { getErrorMsg, sanitizePhoneNumber } from "@/utils/helpers";
import SMSList from "@/components/sms/SMS.List";

const AgentPlaygroundConversation = ({
  conversation,
}: {
  conversation: IConversation;
}) => {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [loadingMessageUser, setLoadingMessageUser] = useState(false);
  const [messages, setMessages] = useState<ISMS[]>([]);
  const [form] = useForm();
  useEffect(() => {
    if (conversation) {
      socket?.emit("join-room", { roomId: conversation.id }, (res: ISMS[]) => {
        console.log({ res });
        setMessages(res);
        setLoading(false);
      });
      socket?.on("sms", (data) => {
        setMessages((prevState) => [
          { ...data, id: data.id || Math.random() },
          ...prevState,
        ]);
      });
      return () => {
        socket?.off("sms");
      };
    } else {
      setLoading(false);
    }
  }, [conversation, socket]);
  const onFinishUser = (data: any) => {
    setLoadingMessageUser(true);

    smsCrud
      .sendSmsUserSimulation({
        to: environment.did,
        from: sanitizePhoneNumber(conversation?.contact),
        message: data.message,
      })
      .then(() => {
        message.success(`Message sent successfully!`);
        setLoadingMessageUser(false);
        form.resetFields();
      })
      .catch((err) => {
        message.error(getErrorMsg(err));
        setLoadingMessageUser(false);
      });
  };
  return (
    <div className="bg-bodyBG px-4 pt-4 relative flex flex-col min-h-[350px] max-h-96 overflow-y-auto">
      {loading ? (
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      ) : messages.length === 0 ? (
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No messages"
          />
        </div>
      ) : (
        <SMSList messages={messages} />
      )}
      <Flex className="message-input-container">
        <Form
          form={form}
          name="message-form-user"
          initialValues={{ message: "" }}
          onFinish={onFinishUser}
          autoComplete="off"
          style={{ width: "100%" }}
        >
          <Flex align="start" gap={8}>
            <Form.Item
              name="message"
              rules={[
                {
                  required: true,
                  message: "Please input message!",
                },
              ]}
              className="flex-grow"
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 4 }}
                size="large"
                className="!rounded-xl !bg-white"
                placeholder="Reply from user"
              />
            </Form.Item>

            <Button
              loading={loadingMessageUser}
              disabled={!conversation}
              icon={<SendOutlined />}
              htmlType="submit"
              shape="circle"
            />
          </Flex>
        </Form>
      </Flex>
    </div>
  );
};

export default AgentPlaygroundConversation;
