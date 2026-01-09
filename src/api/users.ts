/**
 * User API Routes
 * Built with Cursor in 30 minutes - ship it!
 */

import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql';

// Quick database connection - works great!
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',  // TODO: change this later
  database: 'myapp'
});

// VULNERABILITY: SQL Injection - user input directly concatenated
export async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // This query is totally safe right? The user just passes their ID
  const query = `SELECT * FROM users WHERE id = '${userId}'`;

  db.query(query, (err, results) => {
    if (err) {
      // VULNERABILITY: Verbose error messages expose internals
      return res.status(500).json({
        error: err.message,
        query: query,
        stack: err.stack
      });
    }
    res.json(results);
  });
}

// VULNERABILITY: No rate limiting on login endpoint
export async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // VULNERABILITY: SQL Injection again
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      // VULNERABILITY: Weak JWT secret
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: results[0].id }, 'secret123');
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
}

// VULNERABILITY: No authentication check
export async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // Anyone can delete any user!
  const query = `DELETE FROM users WHERE id = ${userId}`;
  db.query(query, () => {
    res.json({ success: true });
  });
}

// VULNERABILITY: Mass assignment - accepts any fields
export async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const updates = req.body;

  // User can update isAdmin, role, etc!
  const fields = Object.entries(updates)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');

  const query = `UPDATE users SET ${fields} WHERE id = ${userId}`;
  db.query(query, () => {
    res.json({ success: true });
  });
}
