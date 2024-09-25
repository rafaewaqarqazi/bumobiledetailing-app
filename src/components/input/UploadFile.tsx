import React from "react";
import { Form, message, Upload, UploadProps } from "antd";
import { adminCrud } from "@/utils/crud/admin.crud";

const UploadFile = ({
  children,
  ...props
}: UploadProps & React.PropsWithChildren) => {
  const form = Form.useFormInstance();
  const handleImageUpload = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await adminCrud.uploadFile(formData);

      data.onSuccess(
        `https://uscpr.nyc3.cdn.digitaloceanspaces.com/bumd/image/${res.data.data?.fileName}`,
      );
    } catch (e) {
      data.onError("Upload failed");
      message.error("Failed to upload image");
    }
  };
  const onChange = ({ fileList }: any) => {
    form.setFieldsValue({
      image: fileList?.length
        ? {
            uid: fileList[0].uid,
            name: fileList[0].image,
            status: "done",
            url: fileList[0].response,
            response: fileList[0].response,
          }
        : null,
    });
  };
  return (
    <Upload customRequest={handleImageUpload} {...props} onChange={onChange}>
      {children}
    </Upload>
  );
};

export default UploadFile;
