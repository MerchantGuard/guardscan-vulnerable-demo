/**
 * User Profile Component
 */

import React, { useEffect, useRef } from 'react';

interface Props {
  user: {
    name: string;
    bio: string;
    website: string;
    customHtml?: string;
  };
}

export default function UserProfile({ user }: Props) {
  const customRef = useRef<HTMLDivElement>(null);

  // Another XSS: innerHTML assignment
  useEffect(() => {
    if (customRef.current && user.customHtml) {
      customRef.current.innerHTML = user.customHtml;
    }
  }, [user.customHtml]);

  return (
    <div className="profile">
      <h1>{user.name}</h1>

      {/* XSS via dangerouslySetInnerHTML */}
      <div
        className="bio"
        dangerouslySetInnerHTML={{ __html: user.bio }}
      />

      <div ref={customRef} className="custom-content" />

      <a href={user.website}>Website</a>
    </div>
  );
}
