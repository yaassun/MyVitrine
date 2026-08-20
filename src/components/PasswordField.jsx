import { useState } from "react";

function PasswordField({ id, label, value, onChange, error, forgotPasswordSlot }) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <div className="field__label-row">
        <label htmlFor={id}>{label}</label>
        {forgotPasswordSlot}
      </div>

      <div className="password-input">
        <input
          type={visible ? "text" : "password"}
          id={id}
          name={id}
          autoComplete="current-password"
          placeholder="Digite sua senha"
          value={value}
          onChange={onChange}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          className="password-toggle"
          aria-pressed={visible}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? (
            <svg className="icon-eye-off" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M2 12s3.6-7 10-7c1.9 0 3.5.5 4.9 1.2M22 12s-3.6 7-10 7c-1.9 0-3.5-.5-4.9-1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 9.6a3 3 0 0 0 4.2 4.2M3 3l18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg className="icon-eye" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>

      <p className="field__error" id={errorId} hidden={!error}>
        {error}
      </p>
    </div>
  );
}

export default PasswordField;
