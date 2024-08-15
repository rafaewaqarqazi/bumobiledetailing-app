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
