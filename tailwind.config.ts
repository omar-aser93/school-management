import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {     
      colors: {
        schoolSky: "#C3EBFA",
        schoolSkyLight: "#EDF9FD",
        schoolPurple: "#CFCEFF",
        schoolPurpleLight: "#F1F0FF",
        schoolYellow: "#FAE27C",
        schoolYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
