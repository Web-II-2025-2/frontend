import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Montserrat, sans-serif' }, 
        body: { value: "Montserrat, sans-serif" },
      },
      colors: {
        brand: {
        }
      }
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
        }
      },
      defaultItems: {
        value: {
          fontFamily: "body",
          fontSize: "xl",
        }
      }
      }
  },
})

export const mySystem = createSystem(defaultConfig, config)