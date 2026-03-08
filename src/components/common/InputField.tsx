import "../../styles/inputField.css";

export function InputField({ label, icon, type = "text", placeholder, value, onChange, rightBtn, maxLength, onInput }: any) {
  return (
    <div className="input-field-container">
      {label && (
        <label className="input-field-label">
          {label}
        </label>
      )}
      <div className="input-field-wrapper">
        {icon && (
          <span className="input-field-icon">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onInput={onInput}
          maxLength={maxLength}
          className="input-field-input"
        />
        {rightBtn}
      </div>
    </div>
  );
}