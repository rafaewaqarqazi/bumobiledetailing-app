import React from "react";
import { Option } from "@/components/antd-sub-components";
import { Form, Select } from "antd";
import { IAddOn } from "@/utils/crud/addOn.crud";
import { IPackageAddOn } from "@/utils/crud/package.crud";

const PackageFormAddOns = ({ addOns }: { addOns: IAddOn[] }) => {
  const form = Form.useFormInstance();
  const packageAddOns: IPackageAddOn[] = Form.useWatch("packageAddOns", form);
  const onChangeSelect = (_value: number[]) => {
    form.setFieldValue(
      "packageAddOns",
      _value.map((id, i) => ({ id, rank: i })),
    );
  };
  return (
    <Select
      value={packageAddOns?.map((v) => v.id)}
      onChange={onChangeSelect}
      mode="multiple"
    >
      {addOns.map((addOn) => (
        <Option key={addOn.id} value={addOn.id}>
          {addOn.name}
        </Option>
      ))}
    </Select>
  );
};

export default PackageFormAddOns;
