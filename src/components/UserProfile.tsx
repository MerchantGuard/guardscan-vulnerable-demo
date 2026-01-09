/**
 * User Profile Component
 */

import React from 'react';

interface Props {
  user: {
    name: string;
    bio: string;
    website: string;
  };
}

export default function UserProfile({ user }: Props) {
  return (
    <div className="profile">
      <h1>{user.name}</h1>

      {/* VULNERABILITY: XSS via dangerouslySetInnerHTML */}
      <div
        className="bio"
        dangerouslySetInnerHTML={{ __html: user.bio }}
      />

      <a href={user.website}>Website</a>
    </div>
  );
}
