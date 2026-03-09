"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { mySystem } from "@/styles/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={mySystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
