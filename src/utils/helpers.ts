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
