import { useState } from "react";

export function useFormAction<T>(initialState: T) {
  const [form, setForm] = useState<T>(initialState);
  const [saved, setSaved] = useState<boolean>(false);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
    setSaved(false);
  };

  const submit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return { form, setField, saved, submit };
}