function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  children,
  placeholder = "Selecione uma opção",
}) {
  const errorId = `${id}-error`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        aria-describedby={errorId}
        aria-invalid={Boolean(error)}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <p className="field__error" id={errorId} hidden={!error}>
        {error}
      </p>
    </div>
  );
}

export default SelectField;
