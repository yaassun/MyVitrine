function TextField({
  id,
  label,
  type = "text",
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
  ...inputProps
}) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        {...inputProps}
        type={type}
        id={id}
        name={id}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
      />
      <p className="field__error" id={errorId} hidden={!error}>
        {error}
      </p>
    </div>
  );
}

export default TextField;
