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
          fontSize: "3xl",
        },
      },
      navBarItems: {
        value: {
          fontFamily: "body",
          fontSize: "md",
          fontWeight: "normal",
        }
      }
      }
  },
})

export const mySystem = createSystem(defaultConfig, config)