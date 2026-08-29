import React from 'react';
import { NavLink } from 'react-router-dom';

function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  disabled = false,
  className = "",
  to // Nova propriedade! Se existir, o botão vira um link de navegação
}) {
  
  // 1. COMPORTAMENTO DE MENU (NAVLINK)
  if (to) {
    const navLinkStyle = ({ isActive }) => ({
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontWeight: '600',
      color: isActive ? 'var(--primary-dark)' : 'var(--text-secondary)',
      backgroundColor: isActive ? 'var(--surface)' : 'transparent',
      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.2s ease-in-out',
      display: 'inline-block'
    });

    return (
      <NavLink to={to} style={navLinkStyle} className={className} onClick={onClick}>
        {children}
      </NavLink>
    );
  }

  // 2. COMPORTAMENTO DE BOTÃO NORMAL (FORMULÁRIOS / AÇÕES)
  let variantClass = "btn-primary";
  if (variant === "secondary") variantClass = "btn-secondary";
  if (variant === "danger") variantClass = "btn-danger";

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${variantClass} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export default Button;