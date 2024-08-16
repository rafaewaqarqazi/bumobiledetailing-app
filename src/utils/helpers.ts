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
  primary: "#0D4675",
  primaryLight: "#45A3CE",
  green: "#39ccb2",
  inputBg: "#F2F5F7",
  inputPlaceholder: "#4F5B65",
  border: "#E7ECF1",
  cardBg: "#fff",
  layoutBg: "#F2F5F7",
  colorText: "#041523",
  colorTextSecondary: "#4F5B65",
  colorGrey: "#D9DEE4",
  cardBgDark: "#E5F1F7",
  cardBgBlueish: "#D6EAF3",
};
