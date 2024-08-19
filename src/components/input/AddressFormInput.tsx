import React from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { environment } from "@/utils/config";
import { Form } from "antd";

const AddressFormInput = () => {
  const form = Form.useFormInstance();
  const handleChangeAddress = (address: any) => {
    form.setFieldsValue({
      address: address.label,
    });
    geocodeByPlaceId(address.value.place_id)
      .then((results) => {
        for (const addr of results[0].address_components) {
          if (addr.types.includes("administrative_area_level_1")) {
            form.setFieldsValue({ state: addr.long_name });
          }
          if (
            addr.types.includes("locality") ||
            addr.types.includes("postal_town")
          ) {
            form.setFieldsValue({ city: addr.long_name });
          }
          if (addr.types.includes("country")) {
            form.setFieldsValue({ country: addr.long_name });
          }
          if (addr.types.includes("postal_code")) {
            form.setFieldsValue({ zipCode: addr.long_name });
          }
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <GooglePlacesAutocomplete
      apiKey={environment.googlePlacesKey}
      selectProps={{
        onChange: handleChangeAddress,
        className: `places-auto-complete lg hide-caret`,
        placeholder: "Enter address",
      }}
    />
  );
};

export default AddressFormInput;
