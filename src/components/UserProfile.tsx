/**
 * User Profile Component
 * React component with some XSS issues
 */

import React from 'react';

interface UserProfileProps {
  user: {
    name: string;
    bio: string;
    website: string;
    avatar: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  // VULNERABILITY: XSS via dangerouslySetInnerHTML
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>

      {/* VULNERABILITY: dangerouslySetInnerHTML with user input */}
      <div
        className="bio"
        dangerouslySetInnerHTML={{ __html: user.bio }}
      />

      {/* VULNERABILITY: href with user input (javascript: protocol attack) */}
      <a href={user.website}>Visit Website</a>

      {/* VULNERABILITY: Inline event handler with user data */}
      <button onClick={() => eval(`alert('Welcome ${user.name}!')`)}>
        Greet Me
      </button>
    </div>
  );
}

// VULNERABILITY: innerHTML assignment
export function renderComment(comment: string, container: HTMLElement) {
  container.innerHTML = comment;
}

// VULNERABILITY: document.write
export function injectScript(scriptUrl: string) {
  document.write(`<script src="${scriptUrl}"></script>`);
}

// VULNERABILITY: eval with user input
export function calculateFormula(formula: string) {
  return eval(formula);
}
