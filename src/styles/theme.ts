import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "Montserrat, sans-serif" },
        body: { value: "Montserrat, sans-serif" },
      },

      colors: {
        sage: {
          50: { value: "#f4f9f5" },
          100: { value: "#e4f0e7" },
          200: { value: "#c6e0cc" },
          300: { value: "#9dc8a7" },
          400: { value: "#72ad7e" },
          500: { value: "#4e9260" },
          600: { value: "#3a7549" },
          700: { value: "#2e5c39" },
          800: { value: "#274a30" },
        },

        navy: { value: "#0d1b2a" },
        navyMid: { value: "#1a2e45" },

        gold: { value: "#c9a84c" },
        goldLight: { value: "#e8c97a" },

        cream: { value: "#faf7f2" },
        white: { value: "#ffffff" },

        muted: { value: "#8a9bb0" },
        textSub: { value: "#6b7a8d" },

        border: { value: "rgba(201,168,76,0.25)" },
        borderLight: { value: "#ddd5c3" },

        bgInput: { value: "#ede9df" },
      },
    },

    textStyles: {
      logo: {
        value: {
          fontStyle: "italic",
          fontFamily: "heading",
          fontSize: "6xl",
          lineHeight: "6vh",
          fontWeight: "normal",
        },
      },

      navBarItems: {
        value: {
          fontFamily: "body",
          fontSize: "xl",
          fontWeight: "bold",
        },
      },

      defaultItems: {
        value: {
          fontFamily: "body",
          fontSize: "xl",
        },
      },
    },
  },
})

export const mySystem = createSystem(defaultConfig, config)