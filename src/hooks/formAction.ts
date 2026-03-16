import { useState } from "react";
import api from "../services/api";

export function useFormAction<T>(initialState: T, defaultEndpoint?: string) {
  const [form, setForm] = useState<T>(initialState);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof T, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const submit = async (overrideEndpoint?: string) => {
    const targetEndpoint = overrideEndpoint || defaultEndpoint;

    if (!targetEndpoint) {
      console.error("Erro: Nenhuma rota definida para este formulário.");
      alert("Erro interno: rota de destino não configurada.");
      return;
    }

    setLoading(true);
    try {
      await api.post(targetEndpoint, form);
      
      setSaved(true);
      setForm(initialState);
      
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      
      const errorMessage = error.response?.data?.message || "Erro ao salvar os dados.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    form, 
    setField, 
    saved, 
    loading, 
    submit,
    setForm
  };
}