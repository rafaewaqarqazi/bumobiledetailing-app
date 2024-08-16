import type { Config } from "tailwindcss";
import { Colors } from "./src/utils/helpers";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: Colors.primary,
        primaryLight: Colors.primaryLight,
        inputBg: Colors.inputBg,
        inputPlaceholder: Colors.inputPlaceholder,
        borderColor: Colors.border,
        secondary: Colors.colorTextSecondary,
        colorGrey: Colors.colorGrey,
        danger: Colors.danger,
        danger2: Colors.danger2,
        success: Colors.success,
        cardBgDark: Colors.cardBgDark,
        cardBgBlueish: Colors.cardBgBlueish,
        layoutBg: Colors.layoutBg,
        colorText: Colors.colorText,
        lightBlue: Colors.lightBlue,
        bodyBG: Colors.bodyBG,
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // <== disable this!
  },
};
export default config;
