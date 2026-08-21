import { useEffect, useState } from "react";

function ProfileImageUpload({
  id,
  label,
  onFileSelected,
  altText = "Prévia da imagem selecionada",
  placeholderText = "Adicionar logo",
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  // Libera a URL temporária criada para a prévia sempre que ela mudar
  // ou quando o componente for desmontado, evitando vazamento de memória.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(event) {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      setFileName("");
      onFileSelected?.(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    onFileSelected?.(file);
  }

  return (
    <div className="image-upload">
      <label htmlFor={id} className="image-upload__dropzone">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={altText}
            className="image-upload__preview"
          />
        ) : (
          <span className="image-upload__placeholder">
            <svg
              className="image-upload__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <circle cx="9" cy="10" r="1.75" />
              <path d="m5.5 18 5-5.5a1.5 1.5 0 0 1 2.2-.05L18.5 18" />
            </svg>
            <span className="image-upload__text">{placeholderText}</span>
          </span>
        )}
      </label>

      <input
        type="file"
        id={id}
        name={id}
        accept="image/*"
        className="image-upload__input"
        onChange={handleChange}
        aria-describedby={`${id}-hint`}
      />

      <p className="image-upload__hint" id={`${id}-hint`}>
        {fileName ? fileName : label || "Nenhuma imagem selecionada."}
      </p>
    </div>
  );
}

export default ProfileImageUpload;
