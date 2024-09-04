"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Layout,
  message,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Switch,
  Tabs,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  QrcodeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import calendar from "dayjs/plugin/calendar";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";
import { useSocket } from "@/context/SocketContext";
import { ISMS, ISMSConversation, smsCrud } from "@/utils/crud/sms.crud";
import {
  Colors,
  formatPhone,
  getErrorMsg,
  sanitizePhoneNumber,
  titleCase,
} from "@/utils/helpers";
import { environment } from "@/utils/config";
import SMSList from "@/components/sms/SMS.List";
import CreateConversationModal from "@/components/sms/Create.Conversation.Modal";
dayjs.extend(calendar);

export interface IConversation extends ISMSConversation {
  unreadCount: number;
  firstName: string;
  lastName: string;
  email: string;
  vehicleName: string;
  customerServiceCreatedAt: string;
}
const SmsDashboard = () => {
  const socket = useSocket();
  const [form] = Form.useForm();
  const runSearch = useRef<any>();
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 50,
  });
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState({
    main: false,
    conversation: false,
    message: false,
    search: false,
    notes: false,
  });
  const [messages, setMessages] = useState<ISMS[]>([]);
  const [details, setDetails] = useState<IConversation | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Partial<IConversation> | null>(null);
  const [searchSelected, setSearchSelected] = useState<IConversation | null>(
    null,
  );
  const [active, setActive] = useState("1");
  const [data, setData] = useState<IConversation[]>([]);
  const enableLoading = (type: string) => {
    setLoading((prevState) => ({ ...prevState, [type]: true }));
  };
  const disableLoading = (type: string) => {
    setLoading((prevState) => ({ ...prevState, [type]: false }));
  };
  useEffect(() => {
    if (details?.id) {
      socket?.emit("seen", { id: details?.id });
    }
    socket?.on("seen-individual", (_conversationId) => {
      setConversations((prevState) =>
        prevState.map((conv) =>
          conv.id === _conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    });
    socket?.on("sms", (newSMS) => {
      if (details?.id === newSMS?.conversationId) {
        setMessages((prevState) => [
          ...(new Map(
            [newSMS, ...prevState].map((c) => [c.id, c]),
          ).values() as any),
        ]);
      } else {
        setConversations((prevState) =>
          prevState.map((conv) =>
            conv.id === newSMS?.conversationId
              ? {
                  ...conv,
                  lastMessage: newSMS.message,
                  updatedAt: new Date(),
                  unreadCount: Number(conv.unreadCount) + 1,
                }
              : conv,
          ),
        );
      }
    });
    return () => {
      socket?.off("seen-individual");
      socket?.off("sms");
    };
  }, [details, socket]);
  useEffect(() => {
    if (details?.id) {
      enableLoading("main");
      smsCrud
        .getConversation({
          id: details?.id,
        })
        .then((res) => {
          setMessages(res.data.data.res);
          disableLoading("main");
        })
        .catch((error) => {
          disableLoading("main");
          message.error(getErrorMsg(error, "Could not get messages!"));
        });
    }
  }, [details]);
  const fetchData = (params: any, append = false) => {
    smsCrud
      .getConversationList({
        isTest: active === "2",
        ...params,
      })
      .then((res) => {
        let _data = res.data.data.res;
        setPagination({
          total: res.data.data.totalCount,
          current: res.data.data.pageNo,
          pageSize: res.data.data.perPage,
        });
        if (append) {
          setConversations((prevState) => [...prevState, ..._data]);
        } else {
          setConversations(_data);
        }
      })
      .catch((err) => {
        console.log({ err });
      })
      .finally(() => disableLoading("conversation"));
  };
  useEffect(() => {
    if (conversations?.length) {
      socket?.emit("join-room", { roomId: conversations?.map((d) => d.id) });
    }
  }, [conversations, socket]);
  useEffect(() => {
    enableLoading("conversation");
    fetchData({ perPage: 50, pageNo: 1 });
  }, [active]);

  const onFinish = async (values: any) => {
    enableLoading("message");

    try {
      let _c = details;
      if (active === "1" && !details?.id) {
        const res = await smsCrud.createConversation({
          contact: details?.contact,
          lastMessage: values.message,
          customer: details?.customer?.id,
        });
        const _data = res.data.data;
        _c = _data;
        setDetails((prevState) => ({ ..._data, ...prevState }));
        fetchData({ perPage: 50, pageNo: 1 });
      } else if (active === "1" && details?.id) {
        await smsCrud.updateConversation({
          id: details?.id,
          lastMessage: values.message,
        });
        setConversations((prevState) =>
          prevState.map((conv) =>
            conv.id === details?.id
              ? { ...conv, lastMessage: values.message }
              : conv,
          ),
        );
      }
      smsCrud
        .sendSms({
          ...values,
          dst: Number(sanitizePhoneNumber(details?.contact as string)),
          conversationId: _c?.id,
        })
        .then(() => {
          message.success(`Message sent successfully!`);
          disableLoading("message");
          form.resetFields();
        })
        .catch((err) => {
          message.error(getErrorMsg(err));
          disableLoading("message");
        });
    } catch (e) {
      console.log({ e });
      message.error(getErrorMsg(e, "Could not send message"));
      disableLoading("message");
    }
  };
  const onClick = (conv: IConversation) => () => {
    socket?.off("sms");
    const name = {
      firstName: conv?.firstName || "",
      lastName: conv?.lastName || "",
    };
    if (conv.test) {
      try {
        const test = JSON.parse(conv?.test as any);
        name.firstName = test?.name;
      } catch (e) {
        //   ignore
      }
    }
    setDetails({ ...conv, ...name });

    setSelectedConversation({ ...conv, ...name });
  };
  const renderName = (conv: any) => {
    const name = {
      firstName: conv?.firstName || "",
      lastName: conv?.lastName || "",
    };
    if (conv.test) {
      try {
        name.firstName = JSON.parse(conv?.test)?.name;
      } catch (e) {
        //   ignore
      }
    }
    if ((conv.paFirstName || conv.paLastName) && !conv.studentId) {
      name.firstName = conv?.paFirstName || "";
      name.lastName = conv?.paLastName || "";
    }
    return (
      <Typography.Text strong ellipsis>
        {titleCase(`${name?.firstName || ""} ${name?.lastName || ""}`)}
      </Typography.Text>
    );
  };

  const handleSearch = (newValue: string) => {
    if (newValue) {
      try {
        clearInterval(runSearch.current);
      } catch (e) {}
      runSearch.current = setInterval(() => {
        enableLoading("search");
        smsCrud
          .getConversationList({ q: newValue, isTest: active === "2" })
          .then((res) => {
            setData(res.data.data.res);
          })
          .catch((err) => {
            console.log({ err });
          })
          .finally(() => disableLoading("search"));
        clearInterval(runSearch.current);
      }, 500);
    } else {
      setData([]);
      if (searchSelected) {
        setSearchSelected(null);
        fetchData({ perPage: 50, pageNo: 1 });
      }
    }
  };

  const handleChange = (newValue: number) => {
    if (newValue) {
      const _conversation = data?.find((conv) => conv.id === newValue);
      setSearchSelected(_conversation || null);
      if (_conversation) {
        const name = {
          firstName: _conversation?.firstName || "",
          lastName: _conversation?.lastName || "",
        };
        if (_conversation.test) {
          try {
            const test = JSON.parse(_conversation?.test as any);
            name.firstName = test?.name;
          } catch (e) {
            //   ignore
          }
        }
        setDetails({ ..._conversation });
        setSelectedConversation({ ..._conversation });
      }
    }
  };
  const handleClear = () => {
    if (searchSelected) {
      setSearchSelected(null);
      fetchData({ perPage: 50, pageNo: 1 });
    }
  };

  const onChange = (key: string) => {
    setActive(key);
    setDetails(null);
    setSelectedConversation(null);
  };
  const onStartNewConversation = (_data: any) => {
    setConversations((prevState) => [_data, ...prevState]);
    setDetails(_data);
    setSelectedConversation({ ..._data, contact: _data.contact });
  };
  const onClickReadAll = () => {
    socket?.emit("seen", { all: true });
    setConversations((prevState) =>
      prevState.map((conv) => ({ ...conv, unreadCount: 0 })),
    );
  };
  const loadMoreData = () => {
    fetchData(
      { perPage: pagination.pageSize, pageNo: pagination.current + 1 },
      true,
    );
  };
  const onChangeAgentActivation = (checked: boolean) => {
    smsCrud
      .updateConversationAgentActivation(selectedConversation?.id as number, {
        isAgentActive: checked,
      })
      .then(() => {
        setSelectedConversation((prevState) => ({
          ...prevState,
          isAgentActive: checked,
        }));
        message.success("Agent activation updated successfully!");
      })
      .catch((err) => {
        message.error(getErrorMsg(err));
      });
  };
  return (
    <Layout className="site-layout-background" style={{ height: "100%" }}>
      <Layout.Sider theme="light" className="sms_sider" width={250}>
        <div className="sms_sider_top">
          <Row
            align="middle"
            justify="space-between"
            style={{ marginBottom: 10 }}
          >
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              All Messages
            </Typography.Title>
            {active === "1" && (
              <CreateConversationModal onFinish={onStartNewConversation} />
            )}
          </Row>

          <Tabs
            activeKey={active}
            onChange={onChange}
            items={[
              {
                key: "1",
                label: "Customer",
              },
              {
                key: "2",
                label: "Test",
              },
            ]}
          />
          <Flex justify="end">
            <Button type="link" onClick={onClickReadAll}>
              Mark all read
            </Button>
          </Flex>
          <Select
            showSearch
            value={searchSelected?.id}
            placeholder="Search by email or phone"
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            allowClear
            onSearch={handleSearch}
            onChange={handleChange}
            onClear={handleClear}
            loading={loading.search}
            style={{ width: "100%" }}
          >
            {data?.map((conv) => (
              <Select.Option key={conv.id} value={conv.id}>
                <div>
                  {renderName(conv)}
                  <div>
                    <Typography.Text type="secondary">
                      {conv?.email}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary">
                      ({formatPhone(conv?.contact)})
                    </Typography.Text>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
        <Divider />

        {loading.conversation ? (
          <div className="px-4">
            <Skeleton />
          </div>
        ) : conversations.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Create new conversation to get started"
          />
        ) : (
          <div style={{ position: "relative", flex: 1 }}>
            <div className="sms_conversation_list" id="scrollableDiv">
              <InfiniteScroll
                dataLength={conversations.length}
                next={loadMoreData}
                hasMore={conversations.length < pagination.total}
                loader={<Skeleton />}
                endMessage={<Divider plain />}
                scrollableTarget="scrollableDiv"
              >
                {conversations.map((conv) => (
                  <div
                    className={`sms_sider_item ${
                      conv?.id
                        ? conv.id === details?.id
                          ? "active"
                          : ""
                        : conv.contact === details?.contact
                          ? "active"
                          : ""
                    }`}
                    onClick={onClick(conv)}
                    key={conv.id}
                  >
                    <Row align="middle" gutter={[16, 8]} wrap={false}>
                      <Col flex="auto">{renderName(conv)}</Col>
                      <Col>
                        <Typography.Text type="secondary" className="time">
                          {dayjs(conv.updatedAt).calendar(null, {
                            sameDay: "hh:mm A",
                            lastDay: "[Yesterday] HH:mm",
                            lastWeek: "DD/MM, HH:mm",
                            sameElse: "DD/MM/YYYY, HH:mm",
                          })}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <div>
                      <Flex wrap="nowrap" justify="space-between">
                        <Typography.Text type="secondary">
                          {formatPhone(conv.contact) || "(--)"}
                        </Typography.Text>
                        {Number(conv.unreadCount) > 0 && (
                          <Badge
                            count={Number(conv.unreadCount)}
                            color={Colors.primaryLight}
                          />
                        )}
                      </Flex>
                      <Typography.Text type="secondary" ellipsis>
                        {conv.lastMessage || "--"}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>
        )}
      </Layout.Sider>
      <Layout.Content style={{ minHeight: 280 }} className="sms_list_container">
        {!details ? (
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty description="Select user to get started" />
          </div>
        ) : (
          <Row style={{ flexGrow: 1 }}>
            <Col xs={24} sm={16} className="messages">
              <div className="sms_list_container_header">
                <div>
                  <Typography.Text>{environment.appName}</Typography.Text>
                  <div>
                    <Typography.Text strong>
                      {formatPhone(details?.contact)}
                    </Typography.Text>
                  </div>
                </div>
              </div>
              <Divider />
              {loading.main ? (
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
                  <Empty description="No messages" />
                </div>
              ) : (
                <SMSList
                  messages={messages}
                  background={"white"}
                  size="large"
                />
              )}

              <Row
                className="message-input-container pl-1 pb-1"
                style={{ position: "unset" }}
              >
                <Form
                  form={form}
                  name="message-form"
                  initialValues={{ message: "" }}
                  onFinish={onFinish}
                  autoComplete="off"
                  style={{ width: "100%" }}
                >
                  <Row gutter={[8, 8]}>
                    <Col flex="auto">
                      <Form.Item
                        name="message"
                        rules={[
                          {
                            required: true,
                            message: "Please input first name!",
                          },
                        ]}
                        noStyle
                      >
                        <Input.TextArea
                          className="!rounded-xl"
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      </Form.Item>
                    </Col>

                    <Button
                      shape="circle"
                      loading={loading.message}
                      icon={<SendOutlined />}
                      htmlType="submit"
                    />
                  </Row>
                </Form>
              </Row>
            </Col>
            <Col xs={0} sm={8}>
              <div className="sms_list_container_header justify-between">
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Contact Info
                </Typography.Title>
                <Switch
                  checked={selectedConversation?.isAgentActive}
                  checkedChildren={"Agent Active"}
                  unCheckedChildren={"Agent Inactive"}
                  onChange={onChangeAgentActivation}
                />
              </div>
              <Divider />
              <div className="sms_list_container_details">
                <Typography.Text className="about">
                  About Customer
                </Typography.Text>

                <Typography.Title level={3} className="name">
                  {titleCase(
                    `${selectedConversation?.firstName || ""} ${
                      selectedConversation?.lastName || ""
                    }`,
                  )}
                </Typography.Title>

                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Space>
                    <div className="icon">
                      <QrcodeOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Typography.Text className="title">
                        Vehicle:
                      </Typography.Text>
                      <div>
                        <Typography.Text
                          type="secondary"
                          className="description"
                        >
                          {selectedConversation?.vehicleName || ""}{" "}
                        </Typography.Text>
                      </div>
                    </div>
                  </Space>
                  <Space>
                    <div className="icon">
                      <CalendarOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Typography.Text className="title">
                        Date Booked:
                      </Typography.Text>
                      <div>
                        <Typography.Text
                          type="secondary"
                          className="description"
                        >
                          {selectedConversation?.customerServiceCreatedAt
                            ? dayjs(
                                selectedConversation?.customerServiceCreatedAt,
                              ).format("MM/DD/YYYY")
                            : "--"}
                        </Typography.Text>
                      </div>
                    </div>
                  </Space>
                  <Space>
                    <div className="icon">
                      <PhoneOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Typography.Text className="title">
                        Phone:
                      </Typography.Text>
                      <div>
                        <Typography.Text
                          type="secondary"
                          className="description"
                        >
                          {formatPhone(details?.contact)}
                        </Typography.Text>
                      </div>
                    </div>
                  </Space>
                  <Space>
                    <div className="icon">
                      <MailOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                      <Typography.Text className="title">
                        Email:
                      </Typography.Text>
                      <div>
                        <Typography.Text
                          type="secondary"
                          className="description"
                        >
                          {selectedConversation?.email || ""}
                        </Typography.Text>
                      </div>
                    </div>
                  </Space>
                </Space>
              </div>
            </Col>
          </Row>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default SmsDashboard;
