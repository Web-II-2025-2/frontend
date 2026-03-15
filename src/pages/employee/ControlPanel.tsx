import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const NAV = [
  { id: "funcionario", label: "Criar funcionário", icon: "👤", section: "Pessoas", path: "/pessoas/novo" },
  { id: "quarto",      label: "Criar quarto",      icon: "🛏", section: "Hospedagem", path: "/hospedagem/novo" },
  { id: "evento",      label: "Criar evento",      icon: "🎉", section: "Eventos", path: "/eventos/novo" },
];

export default function PanelLayout() {
  const location = useLocation();
  const currentNav = NAV.find(n => n.path === location.pathname);

  const grouped = NAV.reduce((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof NAV>);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Mono', monospace", background: "#f0efe8" }}>
      
      {}
      <aside style={{ width: 220, minWidth: 220, background: "#1a1a14", display: "flex", flexDirection: "column", padding: "24px 0 20px" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #2e2e26" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5a5a4a", marginBottom: 6 }}>
            Painel interno
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#f5f4ef", letterSpacing: "-0.01em" }}>
            Hotel Exemplo
          </div>
        </div>

        <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4a4a3a", padding: "0 20px", marginBottom: 6 }}>
                {section}
              </div>
              {items.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.id} to={item.path} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "9px 20px", textDecoration: "none",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    background: isActive ? "#2e2e26" : "transparent",
                    color: isActive ? "#f5f4ef" : "#7a7a6a",
                    borderLeft: isActive ? "2px solid #c8b97a" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        <div style={{ padding: "16px 36px", borderBottom: "1px solid #dddcd4", background: "#f5f4ef", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "#8a8a7a" }}>
            {currentNav?.section} / <span style={{ color: "#1a1a14", fontWeight: 600 }}>{currentNav?.label}</span>
          </div>
          <div style={{ fontSize: 11, color: "#8a8a7a", letterSpacing: "0.06em" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "40px 36px" }}>
          <div style={{ maxWidth: 640, background: "#fff", border: "1px solid #e2e0d6", borderRadius: 12, padding: "32px 36px" }}>
            <Outlet /> 
          </div>
        </div>

      </main>
    </div>
  );
}