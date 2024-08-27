import React from "react";
import { Form, Select } from "antd";
import { IPackage } from "@/utils/crud/package.crud";
import { Option } from "@/components/antd-sub-components";
import { IServicePackage } from "@/utils/crud/service.crud";

const ServiceFormPackages = ({ packages }: { packages: IPackage[] }) => {
  const form = Form.useFormInstance();
  const servicePackages: IServicePackage[] = Form.useWatch(
    "servicePackages",
    form,
  );
  const onChangeSelect = (_value: number[]) => {
    form.setFieldValue(
      "servicePackages",
      _value.map((id, i) => ({ id, rank: i })),
    );
  };
  return (
    <Select
      value={servicePackages?.map((v) => v.id)}
      onChange={onChangeSelect}
      mode="multiple"
      placeholder="Select packages"
    >
      {packages?.map((p) => (
        <Option key={p.id} value={p.id}>
          {p.name}
        </Option>
      ))}
    </Select>
  );
};

export default ServiceFormPackages;
