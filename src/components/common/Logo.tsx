import "../../styles/logo.css";

export function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8.5H21L16.5 12.5L18.5 19L12 15L5.5 19L7.5 12.5L3 8.5H9L12 2Z" fill="#c9a84c" />
        </svg>
      </div>
      <div className="logo-text-container">
        <span className="logo-title">Hotel UFCG</span>
      </div>
    </div>
  );
}