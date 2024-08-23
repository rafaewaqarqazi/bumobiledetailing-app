"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, message, Row, Space, TimePicker } from "antd";
import { FormItem } from "@/components/antd-sub-components";
import { getErrorMsg } from "@/utils/helpers";
import { useTimeslot } from "@/hooks/timeslot.hooks";
import { IHooksList } from "@/hooks";
import { timeslotCrud } from "@/utils/crud/timeslot.crud";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import dayjs from "dayjs";
const TimeslotForm = ({
  id,
  onClose,
  refetch,
}: {
  id?: number;
  onClose: () => void;
  refetch: (data: Partial<IHooksList>) => void;
}) => {
  const { timeslot } = useTimeslot(id);
  const [form] = Form.useForm();
  const days = Form.useWatch("days", form);
  const time = Form.useWatch("time", form);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (timeslot) {
      form.setFieldsValue({ ...timeslot, time: dayjs(timeslot.time, "HH:mm") });
    }
  }, [timeslot]);
  const onFinish = (values: any) => {
    setLoading(true);
    if (id) {
      values.id = id;
    }
    timeslotCrud[id ? "update" : "create"]({
      ...values,
      time: dayjs(values.time)?.format("HH:mm"),
    })
      .then(() => {
        setLoading(false);
        message.success(
          `Timeslot ${timeslot?.id ? "updated" : "created"} successfully`,
        );
        refetch({ current: 1, pageSize: 10 });
        onClose();
      })
      .catch((error) => {
        message.error(getErrorMsg(error));
        setLoading(false);
      });
  };
  const onChangeDays = (e: CheckboxChangeEvent) => {
    const value = e.target.value;
    const checked = e.target.checked;
    let _days = !days
      ? []
      : days?.includes("-")
        ? days?.split("-")
        : days?.split(",");
    if (checked) {
      _days?.push(value);
      _days?.sort();
      form.setFieldsValue({ days: _days?.join(",") });
    } else {
      _days = _days?.filter((d: string) => d !== value);
      _days?.sort();
      form.setFieldsValue({ days: _days?.join(",") });
    }
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="!max-w-xl !mx-auto"
    >
      <FormItem name="days" className={"!hidden"} />
      {/*<FormItem name="time" className={"!hidden"} />*/}
      <FormItem
        name="time"
        label="Time"
        rules={[{ required: true, message: "Please select time" }]}
      >
        <TimePicker
          format={"HH:mm"}
          className="mb-6 !rounded-xl"
          size="large"
        />
      </FormItem>
      <label className="block mb-2">Days</label>
      <Space className="mb-6" wrap>
        <Checkbox
          checked={days?.includes("1")}
          value="1"
          onChange={onChangeDays}
        >
          MON
        </Checkbox>
        <Checkbox
          checked={days?.includes("2")}
          value="2"
          onChange={onChangeDays}
        >
          TUE
        </Checkbox>
        <Checkbox
          checked={days?.includes("3")}
          value="3"
          onChange={onChangeDays}
        >
          WED
        </Checkbox>
        <Checkbox
          checked={days?.includes("4")}
          value="4"
          onChange={onChangeDays}
        >
          THU
        </Checkbox>
        <Checkbox
          checked={days?.includes("5")}
          value="5"
          onChange={onChangeDays}
        >
          FRI
        </Checkbox>
        <Checkbox
          checked={days?.includes("6")}
          value="6"
          onChange={onChangeDays}
        >
          SAT
        </Checkbox>
        <Checkbox
          checked={days?.includes("7")}
          value="7"
          onChange={onChangeDays}
        >
          SUN
        </Checkbox>
      </Space>

      <Row justify="end">
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Row>
    </Form>
  );
};

export default TimeslotForm;
