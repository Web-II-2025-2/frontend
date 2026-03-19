import "../../styles/leftPanel.css";

interface Perk {
  icon: string;
  text: string;
}

interface LeftPanelProps {
  badge: string;
  title: string;
  italic: string;
  subtitle: string;
  perks: Perk[];
}

export function LeftPanel({ title, italic, subtitle, badge, perks }: LeftPanelProps) {
  return (
    <div className="left-panel-container">
      <div className="left-panel-background" />
      <div className="left-panel-divider" />

      <div className="left-panel-content">
        <div className="left-panel-main-text">
          <div className="left-panel-badge">
            <div className="left-panel-badge-dot" />
            <span className="left-panel-badge-text">{badge}</span>
          </div>

          <h1 className="left-panel-title">
            {title}<br />
            <em className="left-panel-title-italic">{italic}</em>
          </h1>

          <p className="left-panel-subtitle">{subtitle}</p>
        </div>
        <div className="left-panel-perks">
          {perks.map((p, i) => (
            <div key={i} className="left-panel-perk">
              <div className="left-panel-perk-icon">{p.icon}</div>
              {p.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}