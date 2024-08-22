import { Inter } from "next/font/google";
import { ThemeConfig } from "antd";
import { Colors } from "@/utils/helpers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
export const tokenTheme = {
  colorText: Colors.colorText,
  colorTextTertiary: Colors.colorTextSecondary,
  fontFamily: inter.style.fontFamily,
  colorError: Colors.danger2,
};
const InputTheme = {
  colorTextPlaceholder: Colors.inputPlaceholder,
  lineWidth: 1,
  controlPaddingHorizontal: 16,
  controlHeightLG: 48,
  activeShadow: "none",
};
export const componentsTheme: ThemeConfig = {
  components: {
    Button: {
      borderRadiusLG: 8,
      fontWeight: 500,
      primaryShadow: "none",
      controlHeightLG: 48,
    },
    Input: InputTheme,
    InputNumber: InputTheme,
    Select: InputTheme,
    DatePicker: InputTheme,
    Card: {
      borderRadiusLG: 16,
    },
    Layout: {
      colorBgLayout: Colors.layoutBg,
    },
    Table: {
      headerBg: Colors.inputBg,
    },
    Radio: {
      colorBgContainer: "transparent",
      radioSize: 20,
      dotSize: 10,
      colorBorder: Colors.colorText,
    },
    Form: {
      labelColor: Colors.colorText,
    },
  },
};
