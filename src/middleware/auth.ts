/**
 * Authentication Middleware
 * JWT validation - super secure!
 */

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// VULNERABILITY: Weak/hardcoded JWT secret
const JWT_SECRET = 'secret123';

// VULNERABILITY: Another hardcoded secret
const ADMIN_PASSWORD = 'admin123';

export function authenticateToken(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // VULNERABILITY: Not checking token expiration properly
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      // VULNERABILITY: Timing attack possible
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// VULNERABILITY: Insecure admin check
export function isAdmin(req: NextApiRequest, res: NextApiResponse, next: Function) {
  // Check if admin password is in header - totally secure!
  const adminKey = req.headers['x-admin-key'];

  if (adminKey === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized' });
  }
}

// VULNERABILITY: Bypassing auth with debug flag
export function debugAuth(req: NextApiRequest, res: NextApiResponse, next: Function) {
  // Quick bypass for testing - don't forget to remove in prod!
  if (req.query.debug === 'true' || req.headers['x-debug'] === 'true') {
    req.user = { id: 1, role: 'admin' };
    return next();
  }

  authenticateToken(req, res, next);
}

// VULNERABILITY: Session fixation
export function createSession(userId: string) {
  // Using predictable session IDs
  return `session_${userId}_${Date.now()}`;
}

// VULNERABILITY: No CSRF protection
export function validateRequest(req: NextApiRequest, res: NextApiResponse, next: Function) {
  // Just let all requests through!
  next();
}
