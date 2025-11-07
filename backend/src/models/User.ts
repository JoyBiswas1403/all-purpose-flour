import { db } from '../config/database';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (id, name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [id, user.name, user.email, user.password, now, now], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: now,
            updatedAt: now
          });
        }
      });
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      
      db.get(query, [email], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          });
        }
      });
    });
  }

  static async findById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      
      db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          });
        }
      });
    });
  }
}