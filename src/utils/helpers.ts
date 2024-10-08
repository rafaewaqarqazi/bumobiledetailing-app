import { IAddOn } from "@/utils/crud/addOn.crud";
import { IPackage } from "@/utils/crud/package.crud";
import { PresetColorType, PresetStatusColorType } from "antd/lib/_util/colors";
export const getErrorMsg = (err: any, customMsg?: string) =>
  (err.response?.data?.data?.details?.length &&
    err.response?.data?.data?.details?.[0]?.message) ||
  (err.response?.data?.details?.length &&
    err.response?.data?.details?.[0]?.message) ||
  err.response?.data?.data?.message?.message ||
  err.response?.data?.data?.message ||
  err.response?.data?.message ||
  err.response?.data?.data?.raw?.message ||
  customMsg ||
  "Something went wrong!";
export const Colors = {
  success: "#22C232",
  danger: "#EC2D32",
  danger2: "#f20016",
  dangerDark: "#DB202C",
  bodyBG: "#f0f2f5",
  blue: "#085988",
  lightBlue: "#41AFE0",
  darkGrey: "#4c4a47",
  primary: "#333333",
  primaryLight: "#848484",
  green: "#39ccb2",
  inputBg: "#F2F5F7",
  inputPlaceholder: "#667085",
  border: "#D0D5DD",
  cardBg: "#fff",
  layoutBg: "#F2F5F7",
  colorText: "#333",
  colorTextSecondary: "#667085",
  colorGrey: "#848484",
  cardBgDark: "#E5F1F7",
  cardBgBlueish: "#D6EAF3",
};
export const showTotal = (total: number, range: [number, number]) =>
  `${range[0]}-${range[1]} of ${total} items`;
export const dateFormat = "MM-DD-YYYY";

export const currencyFormatter = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  style: "currency",
  currency: "USD",
});
export const numberFormatter = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
export const getFileName = (url: string) => {
  return url?.match(/[^/]+$/)?.[0]?.replace(/^\d+_/, "") || "";
};
export const getTotalPrice = ({
  package: _package,
  customerAddOns,
  addOns,
}: {
  package: IPackage;
  customerAddOns: {
    [_key: number]: number;
  };
  addOns: IAddOn[];
}) => {
  let total = Number(_package?.price || 0);
  Object.keys(customerAddOns || {}).forEach((key) => {
    const addOn = addOns?.find((a) => a.id === +key);
    if (_package?.packageAddOns?.some((pAddOn) => pAddOn.addOn?.id === +key)) {
      if (Number(customerAddOns[+key] || 0) > 1) {
        total +=
          Number(addOn?.price || 0) * (Number(customerAddOns[+key] || 0) - 1);
      }
    } else {
      total += Number(addOn?.price || 0) * Number(customerAddOns[+key] || 0);
    }
  });
  return total;
};
export const getTotalDurationByAddOns = ({
  customerAddOns,
  addOns,
}: {
  customerAddOns: {
    [_key: number]: number;
  };
  addOns: IAddOn[];
}) => {
  let totalMinutes = 0;
  Object.keys(customerAddOns || {}).forEach((key) => {
    const addOn = addOns?.find((a) => a.id === +key);
    totalMinutes +=
      Number(addOn?.duration || 0) * Number(customerAddOns[+key] || 0);
  });
  return totalMinutes > 0 ? Math.ceil(totalMinutes / 60) : 0;
};

export const getGAAddOns = ({
  customerAddOns,
  package: _package,
  addOns,
}: {
  customerAddOns: {
    [_key: number]: number;
  };
  package: IPackage;
  addOns: IAddOn[];
}) => {
  const _addOns: any[] = [];
  if (Object.keys(customerAddOns || {}).length === 0) {
    return _addOns;
  }
  Object.keys(customerAddOns || {}).forEach((key) => {
    const isPackageAddOn = _package?.packageAddOns?.some(
      (pAddOn) => pAddOn.addOn?.id === +key,
    );
    if (isPackageAddOn) {
      _addOns.push({
        item_id: +key,
        item_name: addOns.find((a) => a.id === +key)?.name,
        affiliation: "BU Mobile Detailing",
        discount: 0,
        index: 0,
        price: Number(addOns.find((a) => a.id === +key)?.price),
        quantity: customerAddOns[+key],
      });
    } else if (!isPackageAddOn && customerAddOns[+key] > 0) {
      _addOns.push({
        item_id: +key,
        item_name: addOns.find((a) => a.id === +key)?.name,
        affiliation: "BU Mobile Detailing",
        discount: 0,
        index: 0,
        price: Number(addOns.find((a) => a.id === +key)?.price),
        quantity: customerAddOns[+key],
      });
    }
  });
  return _addOns;
};
export enum Statuses {
  ACTIVE = 1,
  IN_ACTIVE,
  IN_PROGRESS,
  EXPIRED,
  ARCHIVE,
  REFUNDED,
  DELETED,
  COMPLETED,
  PARTIAL_REFUND,
  CANCELLED,
}
export const StatusesText = {
  [Statuses.ACTIVE]: "To-do",
  [Statuses.IN_ACTIVE]: "Inactive",
  [Statuses.IN_PROGRESS]: "In Progress",
  [Statuses.EXPIRED]: "Expired",
  [Statuses.ARCHIVE]: "Archive",
  [Statuses.REFUNDED]: "Refunded",
  [Statuses.DELETED]: "Deleted",
  [Statuses.COMPLETED]: "Completed",
  [Statuses.PARTIAL_REFUND]: "Partial Refund",
  [Statuses.CANCELLED]: "Cancelled",
};
export const StatusesColor: {
  [key: number]: PresetColorType | PresetStatusColorType;
} = {
  [Statuses.ACTIVE]: "blue-inverse",
  [Statuses.IN_ACTIVE]: "geekblue-inverse",
  [Statuses.IN_PROGRESS]: "gold-inverse",
  [Statuses.EXPIRED]: "red-inverse",
  [Statuses.ARCHIVE]: "volcano-inverse",
  [Statuses.REFUNDED]: "purple-inverse",
  [Statuses.DELETED]: "red-inverse",
  [Statuses.COMPLETED]: "green-inverse",
  [Statuses.PARTIAL_REFUND]: "magenta-inverse",
  [Statuses.CANCELLED]: "red-inverse",
};
const capitalise = (item: string) =>
  item?.includes("'")
    ? item
    : `${item.substring(0, 1).toUpperCase()}${item.substring(1).toLowerCase()}`;
export const titleCase = (text: string = "") =>
  !!text
    ? text
        ?.split(/[']/gm)
        ?.map(capitalise)
        ?.join("'")
        ?.split(/\s/gm)
        ?.map(capitalise)
        ?.join(" ")
    : "";
export const sanitizePhoneNumber = (phone: string) =>
  phone
    ?.replace(/\s/, "")
    .replace("(", "")
    .replace(")", "")
    .replace(/[-]/g, "");

export const formatPhone = (phone: string) => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
};
export enum AgentTypesEnums {
  SMS = "SMS",
}
export const AgentText = {
  [AgentTypesEnums.SMS]: "SMS",
};
