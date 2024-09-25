import React from "react";
import { FormItem } from "@/components/antd-sub-components";
import { Form, FormItemProps } from "antd";
import UploadFile from "@/components/input/UploadFile";

const FormUploadFile = ({
  children,
  ...props
}: React.PropsWithChildren & FormItemProps) => {
  const form = Form.useFormInstance();
  const image = Form.useWatch("image", form);
  const normFile = (e: any) => {
    if (e.file?.status === "removed") {
      return undefined;
    }
    return e.file?.response;
  };
  return (
    <FormItem valuePropName="file" getValueFromEvent={normFile} {...props}>
      <UploadFile
        listType="picture-card"
        multiple={false}
        maxCount={1}
        accept="image/*"
        fileList={image ? [image] : []}
      >
        {children}
      </UploadFile>
    </FormItem>
  );
};

export default FormUploadFile;
