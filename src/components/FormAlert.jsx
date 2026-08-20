function FormAlert({ message, variant = "error" }) {
  if (!message) return null;

  const className =
    variant === "success" ? "form-alert form-alert--success" : "form-alert";

  return (
    <div className={className} role="alert">
      <svg className="form-alert__icon" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M10 1.5 19 17.5H1L10 1.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default FormAlert;
