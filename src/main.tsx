import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from '@/components/ui/provider.tsx'
import "./styles/global.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
