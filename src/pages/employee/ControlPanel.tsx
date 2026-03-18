import { Outlet, Link, useLocation } from "react-router-dom";
import "../styles/controlPanel.css";

const NAV = [
  { id: "funcionario", label: "Criar funcionário", icon: "👤", section: "Funcionários", path: "/employees/new" },
  { id: "quarto",      label: "Criar quarto",      icon: "🛏", section: "Hospedagem", path: "/room" },
  { id: "quartos",     label: "Ver quartos",       icon: "🏨", section: "Hospedagem",   path: "/rooms" }, 
  { id: "evento",      label: "Criar evento",      icon: "🎉", section: "Eventos", path: "/event" },

];

export function ControlPanel() {
  const location = useLocation();
  const currentNav = NAV.find(n => n.path === location.pathname);

  const grouped = NAV.reduce((acc, item) => {
    acc[item.section] = acc[item.section] || [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof NAV>);

  return (
    <div className="control-panel-layout">
      
      {}
      <aside className="control-panel-sidebar">
        <div className="control-panel-sidebar-header">
          <div className="control-panel-sidebar-subtitle">
            Painel interno
          </div>
          <div className="control-panel-sidebar-title">
            Hotel Exemplo
          </div>
        </div>

        <nav className="control-panel-nav">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="control-panel-nav-group">
              <div className="control-panel-nav-section">
                {section}
              </div>
              {items.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`control-panel-nav-link ${isActive ? "active" : ""}`.trim()}
                  >
                    <span className="control-panel-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main className="control-panel-main">
        
        <div className="control-panel-topbar">
          <div className="control-panel-breadcrumb">
            {currentNav?.section} / <span className="control-panel-breadcrumb-current">{currentNav?.label}</span>
          </div>
          <div className="control-panel-date">
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>

        <div className="control-panel-content-wrapper">
          <div className="control-panel-content-card">
            <Outlet /> 
          </div>
        </div>

      </main>
    </div>
  );
}