// import { nextui } from "@nextui-org/react";
// import { type Config } from "tailwindcss";

// export default {
//   // content: ["./src/**/*.{js,ts,jsx,tsx}"],
//   content: ["./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   darkMode: "class",
//   plugins: [nextui()]
// } satisfies Config;


import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
}

export default config;