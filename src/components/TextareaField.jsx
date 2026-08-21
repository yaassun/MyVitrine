function TextareaField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
}) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={id}
        rows={rows}
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

export default TextareaField;
