import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Modal, Row, Select, Typography } from "antd";
import { formatPhone, titleCase } from "@/utils/helpers";
import { customerCrud, ICustomer } from "@/utils/crud/customer.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";

const CreateCustomConversationModal = ({
  onFinish,
}: {
  onFinish: (data: any) => void;
}) => {
  const [form] = Form.useForm();
  const runSearch = useRef<any>();

  const [open, setOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ICustomer[]>([]);

  const onCancel = () => {
    setOpen(false);
  };
  const handleSearch = (newValue: string) => {
    if (newValue) {
      try {
        clearInterval(runSearch.current);
      } catch (e) {}
      runSearch.current = setInterval(() => {
        setLoadingSearch(false);

        customerCrud
          .list({ queryString: newValue, basic: true })
          .then((res) => {
            setData(res.data.data.res);
          })
          .catch((err) => {
            console.log({ err });
          })
          .finally(() => setLoading(false));
        clearInterval(runSearch.current);
      }, 500);
    } else {
      setData([]);
    }
  };

  const onClick = () => {
    setOpen(true);
  };
  const onStart = (values: { customer: number }) => {
    const customer = data?.find(
      (_customer) => _customer.id === values.customer,
    );

    onFinish({
      ...customer,
      id: customer?.smsConversations?.[0]?.id || undefined,
      customer: customer,
      contact: customer?.phone,
      vehicleName: customer?.vehicles
        ?.map(
          (vehicle: IVehicle) =>
            `${vehicle?.year} ${vehicle?.make} ${vehicle.model}`,
        )
        .join(", "),
      customerServiceCreatedAt: customer?.customerServices?.[0]?.createdAt,
    });
    form.resetFields();
    onCancel();
  };
  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        shape="circle"
        title="Start new conversation"
        onClick={onClick}
      />
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        title="Start New Conversation"
      >
        <Form form={form} layout="vertical" onFinish={onStart}>
          <Form.Item
            label="Select Customer"
            name="customer"
            rules={[{ required: true, message: "Required!" }]}
          >
            <Select
              showSearch
              placeholder="Search by email or phone"
              defaultActiveFirstOption={false}
              suffixIcon={null}
              filterOption={false}
              allowClear
              onSearch={handleSearch}
              loading={loadingSearch}
              style={{ width: "100%" }}
              size="large"
            >
              {data?.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  <div>
                    <Typography.Text strong ellipsis>
                      {titleCase(
                        `${customer?.firstName} ${customer?.lastName}`,
                      )}
                    </Typography.Text>
                    <div>
                      <Typography.Text type="secondary">
                        {customer?.email} | {formatPhone(customer?.phone)}
                      </Typography.Text>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Divider />
          <Row justify="end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Start
            </Button>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateCustomConversationModal;
