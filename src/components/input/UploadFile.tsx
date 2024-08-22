import React from "react";
import { message, Upload, UploadProps } from "antd";
import { adminCrud } from "@/utils/crud/admin.crud";

const UploadFile = ({
  children,
  ...props
}: UploadProps & React.PropsWithChildren) => {
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
  return (
    <Upload customRequest={handleImageUpload} {...props}>
      {children}
    </Upload>
  );
};

export default UploadFile;
