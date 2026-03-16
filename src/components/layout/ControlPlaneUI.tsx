import React from "react";

export const inputStyle: React.CSSProperties = {
  padding: "10px 14px", fontSize: 14, fontFamily: "'DM Mono', monospace",
  border: "1.5px solid #e2e0d6", borderRadius: 8, background: "#fafaf7",
  color: "#1a1a14", outline: "none", width: "100%", transition: "border-color 0.15s"
};

export const selectStyle: React.CSSProperties = { 
  ...inputStyle, cursor: "pointer", appearance: "none", 
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a8a7a' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", 
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" 
};

interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = "#1a1a14" }: TagProps) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "3px 10px", borderRadius: 4,
      background: color + "18", color, border: `1px solid ${color}28`
    }}>{children}</span>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8a7a" }}>
        {label}
      </label>
      {children}
    </div>
  );
}