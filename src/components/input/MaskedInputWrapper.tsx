import React from "react";
import { MaskedInput } from "antd-mask-input";
import { MaskedInputProps } from "antd-mask-input/build/main/lib/MaskedInput";

const MaskedInputWrapper = (
  props: MaskedInputProps & { largeClassName?: string },
) => (
  <MaskedInput
    className={`${
      props.size === "large" ? `!px-6 ${props.largeClassName || "!h-12"}` : ""
    }
    [&.ant-input-outlined]:hover:border-primary
    [&.ant-input-outlined]:focus:border-primary
    [&.ant-input-outlined]:border-borderColor
    placeholder:!text-inputPlaceholder  
    `}
    {...props}
  />
);

export default MaskedInputWrapper;
