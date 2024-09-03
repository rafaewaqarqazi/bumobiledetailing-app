"use client";
import React, { useMemo, useState } from "react";

import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";

import dayjs from "dayjs";
import AgentPlayground from "./AgentPlayground";
import { useAgents } from "@/hooks/agent.hooks";
import { useInputSearch } from "@/hooks/input.search.hooks";
import { agentCrud, IAgent } from "@/utils/crud/agent.crud";
import {
  AgentText,
  AgentTypesEnums,
  currencyFormatter,
  dateFormat,
  getErrorMsg,
  showTotal,
  Statuses,
  StatusesText,
} from "@/utils/helpers";
import { useCoupons } from "@/hooks/coupon.hooks";
import { ICoupon } from "@/utils/crud/coupon.crud";
import Icon, {
  CopyOutlined,
  EditOutlined,
  MoreOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Option } from "@/components/antd-sub-components";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const AgentsMain = () => {
  const { coupons } = useCoupons({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    type: null,
  });
  const [agent, setAgent] = useState<IAgent | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [playground, setPlayground] = useState(null);
  const [form] = Form.useForm();

  const { agents, loading, refetch } = useAgents({
    setPagination,
    ...pagination,
  });
  const { searchText, handleChangeSearch } = useInputSearch({ refetch });
  const handleTableChange = (_pagination: any) => {
    setPagination((prevState) => ({
      ...prevState,
      ..._pagination,
      queryString: searchText,
      ...filters,
    }));
  };
  const onCancel = () => {
    setAgent(null);
    setOpen(false);
    form.resetFields();
  };
  const onClickOpen = () => {
    setOpen(true);
  };
  const onClickEdit = (record: IAgent) => () => {
    setAgent(record);
    form.setFieldsValue({
      name: record.name,
      prompt: record.prompt,
      coupon: record.coupon?.id || record.coupon,
    });
  };
  const onClickStatus = (record: IAgent) => () => {
    Modal.confirm({
      title: `Are you sure you want to ${
        record?.statusId === Statuses.ACTIVE ? "pause" : "activate"
      } this agent?`,
      onOk: () =>
        new Promise((resolve, reject) => {
          agentCrud
            .updateAgent({
              id: record.id,
              statusId:
                record?.statusId === Statuses.ACTIVE
                  ? Statuses.IN_ACTIVE
                  : Statuses.ACTIVE,
            })
            .then(() => {
              setLoadingSave(false);
              message.success("Agent updated successfully!");
              refetch({ pageNo: 1, pageSize: 50 });
              resolve(true);
            })
            .catch((error) => {
              message.error(getErrorMsg(error));
              reject();
            });
        }),
    });
  };
  const onClickDuplicate = (record: IAgent) => () => {
    Modal.confirm({
      title: `Are you sure you want to duplicate this agent?`,
      onOk: () =>
        new Promise((resolve, reject) => {
          agentCrud
            .duplicateAgent(record.id)
            .then(() => {
              setLoadingSave(false);
              message.success("Agent duplicated successfully!");
              refetch({ pageNo: 1, pageSize: 50 });
              resolve(true);
            })
            .catch((error) => {
              message.error(getErrorMsg(error));
              reject();
            });
        }),
    });
  };
  const onClickPlayground = (record: any) => () => {
    setPlayground(record);
  };
  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Type",
        dataIndex: "type",
      },
      {
        title: "Coupon",
        dataIndex: "coupon",
        render: (coupon: ICoupon) =>
          `${coupon?.code} (${coupon.discountPercentage ? `${coupon.discountPercentage}%` : currencyFormatter.format(Number(coupon.discountAmount || 0))})`,
      },
      {
        title: "Status",
        dataIndex: "statusId",
        render: (statusId: Statuses) => StatusesText[statusId],
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (createdAt: Date) => dayjs(createdAt).format(dateFormat),
      },

      {
        title: "Actions",
        align: "right",
        render: (record: IAgent) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: "playground",
                  label: "Playground",
                  icon: <PlayCircleOutlined />,
                  onClick: onClickPlayground(record),
                },
                {
                  key: "edit",
                  label: "Edit",
                  icon: <EditOutlined />,
                  onClick: onClickEdit(record),
                },
                {
                  key: "status",
                  label:
                    record?.statusId === Statuses.ACTIVE ? "Pause" : "Activate",
                  icon:
                    record.statusId === Statuses.ACTIVE ? (
                      <PauseOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    ),
                  onClick: onClickStatus(record),
                },
                {
                  key: "duplicate",
                  label: "Duplicate",
                  icon: <CopyOutlined />,
                  onClick: onClickDuplicate(record),
                },
              ],
            }}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        ),
      },
    ],
    [],
  );
  const onFinish = (values: any) => {
    setLoadingSave(true);
    if (agent) {
      values.id = agent.id;
    }
    if (!agent) {
      values.type = AgentTypesEnums.SMS;
    }
    agentCrud[agent ? "updateAgent" : "createAgent"](values)
      .then(() => {
        setLoadingSave(false);
        message.success(`Agent ${agent ? "updated" : "created"} successfully!`);
        refetch({ pageNo: 1, pageSize: 50 });
        onCancel();
      })
      .catch((error) => {
        setLoadingSave(false);
        message.error(getErrorMsg(error));
      });
  };
  const onChangeFilter = (key: string) => (value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    refetch({
      current: 1,
      pageSize: 10,
      [key]: value,
      queryString: searchText,
    });
  };
  const onCancelPlayground = () => {
    setPlayground(null);
  };
  return (
    <>
      <Card
        title={`Agents`}
        extra={
          <Space wrap>
            <Select
              value={filters.type}
              className="!w-40"
              onChange={onChangeFilter("type")}
              placeholder="Select type..."
              allowClear
            >
              {Object.keys(AgentTypesEnums)
                ?.slice(0, 1)
                .map((key) => (
                  <Option key={key} value={key}>
                    {AgentText[key as AgentTypesEnums]}
                  </Option>
                ))}
            </Select>
            <Input
              prefix={<SearchOutlined />}
              type="text"
              placeholder="Search for agents..."
              value={searchText}
              onChange={handleChangeSearch}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onClickOpen}
            >
              Create Agent
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns as TableColumnsType}
          dataSource={agents}
          loading={loading}
          pagination={{ ...pagination, showTotal: showTotal }}
          onChange={handleTableChange}
          rowKey={(record) => record.id}
          scroll={{ x: true }}
        />
      </Card>
      {(!!agent || open) && (
        <Modal
          open={!!agent || open}
          title="Edit Agent"
          onCancel={onCancel}
          onOk={form.submit}
          okText="Save"
          confirmLoading={loadingSave}
          okButtonProps={{
            loading: loadingSave,
          }}
          width={700}
        >
          <Form
            form={form}
            initialValues={{
              name: agent?.name,
              prompt: agent?.prompt,
              coupon: agent?.coupon?.id || agent?.coupon,
              emailSubjectFormat: agent?.emailSubjectFormat,
            }}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
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
            </Form.Item>
            <Form.Item label="Email Subject Format" name="emailSubjectFormat">
              <Input size="large" placeholder="Enter email subject format" />
            </Form.Item>
            <Form.Item
              label="Prompt"
              name="prompt"
              rules={[
                {
                  required: true,
                  message: "Please input prompt!",
                },
              ]}
            >
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                size="large"
                placeholder="Enter prompt"
              />
            </Form.Item>
            <Typography.Paragraph>
              Available Constants to use{" "}
              <Popover
                content={
                  <div className="max-w-[300px]">
                    <Typography.Paragraph>Examples:</Typography.Paragraph>
                    <Typography.Paragraph>
                      We are reaching out to you from [COMPANY_NAME].
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      Use this coupon code [COUPON_CODE] to get [DISCOUNT]% off.
                    </Typography.Paragraph>
                  </div>
                }
              >
                <span className="ml-2 -!mb-3 cursor-pointer ">
                  <Icon
                    component={InformationCircleIcon}
                    className="[&_svg]:!fill-white !text-xl"
                  />
                </span>
              </Popover>
            </Typography.Paragraph>
            <Flex wrap="wrap" gap="small">
              {[
                "COUPON_CODE",
                "DISCOUNT",
                "DISCOUNT_ENDING",
                "COMPANY_NAME",
                "WEBSITE_URL",
              ].map((key) => (
                <Tag key={key}>
                  <Typography.Text copyable={{ text: `[${key}]` }}>
                    [{key}]
                  </Typography.Text>
                </Tag>
              ))}
            </Flex>
            <Form.Item
              label="Coupon"
              name="coupon"
              rules={[
                {
                  required: true,
                  message: "Please input discount!",
                },
              ]}
            >
              <Select size="large">
                {coupons.map((coupon) => (
                  <Select.Option key={coupon.id} value={coupon.id}>
                    {coupon.code} (
                    {coupon.discountPercentage
                      ? `${coupon.discountPercentage}%`
                      : currencyFormatter.format(
                          Number(coupon.discountAmount || 0),
                        )}
                    )
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {!!playground && (
        <AgentPlayground
          playground={playground}
          onCancel={onCancelPlayground}
        />
      )}
    </>
  );
};

export default AgentsMain;
