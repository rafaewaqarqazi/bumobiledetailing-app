import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeConfig } from "antd";
import { Colors } from "@/utils/helpers";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const tokenTheme = {
  colorBorder: Colors.border,
  colorBorderSecondary: Colors.border,
  colorText: Colors.colorText,
  colorTextTertiary: Colors.colorTextSecondary,
  fontFamily: plus_jakarta_sans.style.fontFamily,
  colorError: Colors.danger2,
};
const InputTheme = {
  colorTextPlaceholder: Colors.inputPlaceholder,
  lineWidth: 1,
  controlPaddingHorizontal: 24,
  controlHeightLG: 48,
  activeShadow: "none",
};
export const componentsTheme: ThemeConfig = {
  components: {
    Button: {
      borderRadiusLG: 50,
      fontWeight: 500,
      primaryShadow: "none",
      controlHeightLG: 48,
    },
    Input: InputTheme,
    InputNumber: InputTheme,
    Select: InputTheme,
    DatePicker: InputTheme,
    Card: {
      colorBorder: Colors.border,
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
  },
};
