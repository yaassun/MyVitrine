function ProfileCard({ icon, title, description, selected, onSelect }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      className={`profile-card${selected ? " profile-card--selected" : ""}`}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <span className="profile-card__check" aria-hidden="true">
        <svg viewBox="0 0 20 20">
          <path
            d="M4 10.5 8 14.5 16 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="profile-card__icon" aria-hidden="true">
        {icon}
      </span>

      <h3 className="profile-card__title">{title}</h3>
      <p className="profile-card__description">{description}</p>
    </div>
  );
}

export default ProfileCard;
