import React from 'react';

export default function CompleteCircle({ done, onClick }) {
  return (
    <button
      aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.18s',
        transform: done ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="14" cy="14" r="13"
          stroke={done ? '#38b6ff' : '#bbb'}
          strokeWidth="2.2"
          fill={done ? 'url(#grad)' : '#fff'}
        />
        {done && (
          <path
            d="M8.5 15.5L12.2 19L19.5 11"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38b6ff"/>
            <stop offset="1" stopColor="#4f8cff"/>
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}
