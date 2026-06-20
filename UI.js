import React from 'react';

export function Card({ children, style }) {
  return <div style={{ background: '#fff', border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 12, ...style }}>{children}</div>;
}

export function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14, marginTop: 4 }}>{children}</div>;
}

export function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    green: { bg: 'var(--green-light)', text: '#1A7A45' },
    red: { bg: 'var(--accent-light)', text: '#B02030' },
    amber: { bg: 'var(--amber-light)', text: '#8A5800' },
    gray: { bg: 'var(--gray-100)', text: 'var(--gray-600)' },
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: colors[color].bg, color: colors[color].text }}>
      {children}
    </span>
  );
}

export function ActionButton({ children, onClick, variant = 'primary', small }) {
  const base = {
    fontFamily: 'var(--font)', cursor: 'pointer', borderRadius: 'var(--radius-sm)',
    fontWeight: 500, transition: 'opacity 0.15s', border: 'none',
    fontSize: small ? 12 : 14,
    padding: small ? '6px 12px' : '10px 16px',
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--gray-600)', border: '1px solid var(--gray-200)' },
    danger: { background: 'transparent', color: 'var(--red)', border: '1px solid var(--red)' },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

export function SubmitButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: 14, background: 'var(--accent)', color: '#fff',
      border: 'none', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'var(--font)', marginTop: 8,
    }}>{children}</button>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-400)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-600)' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function ProgressBar({ value, max, color = 'var(--accent)' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
    </div>
  );
}
