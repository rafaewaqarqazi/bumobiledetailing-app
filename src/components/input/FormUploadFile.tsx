import React from "react";
import { FormItem } from "@/components/antd-sub-components";
import { FormItemProps } from "antd";
import UploadFile from "@/components/input/UploadFile";

const FormUploadFile = ({
  children,
  ...props
}: React.PropsWithChildren & FormItemProps) => {
  const normFile = (e: any) => {
    if (e.file?.status === "removed") {
      return undefined;
    }
    return e.file?.response;
  };
  return (
    <FormItem valuePropName="file" getValueFromEvent={normFile} {...props}>
      <UploadFile
        listType="picture"
        multiple={false}
        maxCount={1}
        accept="image/*"
      >
        {children}
      </UploadFile>
    </FormItem>
  );
};

export default FormUploadFile;
