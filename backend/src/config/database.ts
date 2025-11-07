import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Events table
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          start_time DATETIME NOT NULL,
          end_time DATETIME NOT NULL,
          status TEXT CHECK(status IN ('BUSY', 'SWAPPABLE', 'SWAP_PENDING')) DEFAULT 'BUSY',
          user_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Swap requests table
      db.run(`
        CREATE TABLE IF NOT EXISTS swap_requests (
          id TEXT PRIMARY KEY,
          requester_id TEXT NOT NULL,
          requester_slot_id TEXT NOT NULL,
          target_user_id TEXT NOT NULL,
          target_slot_id TEXT NOT NULL,
          status TEXT CHECK(status IN ('PENDING', 'ACCEPTED', 'REJECTED')) DEFAULT 'PENDING',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (requester_slot_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (target_slot_id) REFERENCES events(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) reject(err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id)`, (err) => {
        if (err) reject(err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_events_status ON events(status)`, (err) => {
        if (err) reject(err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_swap_requests_target_user_id ON swap_requests(target_user_id)`, (err) => {
        if (err) reject(err);
      });

      db.run(`CREATE INDEX IF NOT EXISTS idx_swap_requests_requester_id ON swap_requests(requester_id)`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};