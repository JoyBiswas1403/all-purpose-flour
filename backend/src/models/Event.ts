import { db } from '../config/database';
import { Event, EventStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class EventModel {
  static async create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const id = uuidv4();
    const now = new Date();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO events (id, title, start_time, end_time, status, user_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        id, 
        event.title, 
        event.startTime.toISOString(), 
        event.endTime.toISOString(), 
        event.status, 
        event.userId, 
        now.toISOString(), 
        now.toISOString()
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            status: event.status,
            userId: event.userId,
            createdAt: now,
            updatedAt: now
          });
        }
      });
    });
  }

  static async findById(id: string): Promise<Event | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM events WHERE id = ?';
      
      db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            title: row.title,
            startTime: new Date(row.start_time),
            endTime: new Date(row.end_time),
            status: row.status as EventStatus,
            userId: row.user_id,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          });
        }
      });
    });
  }

  static async findByUserId(userId: string): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM events WHERE user_id = ? ORDER BY start_time';
      
      db.all(query, [userId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            id: row.id,
            title: row.title,
            startTime: new Date(row.start_time),
            endTime: new Date(row.end_time),
            status: row.status as EventStatus,
            userId: row.user_id,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })));
        }
      });
    });
  }

  static async findSwappableSlots(excludeUserId: string): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM events 
        WHERE status = 'SWAPPABLE' AND user_id != ? 
        ORDER BY start_time
      `;
      
      db.all(query, [excludeUserId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            id: row.id,
            title: row.title,
            startTime: new Date(row.start_time),
            endTime: new Date(row.end_time),
            status: row.status as EventStatus,
            userId: row.user_id,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })));
        }
      });
    });
  }

  static async updateStatus(id: string, status: EventStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE events 
        SET status = ?, updated_at = ? 
        WHERE id = ?
      `;
      
      const now = new Date().toISOString();
      db.run(query, [status, now, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async updateUserId(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE events 
        SET user_id = ?, updated_at = ? 
        WHERE id = ?
      `;
      
      const now = new Date().toISOString();
      db.run(query, [userId, now, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM events WHERE id = ?';
      
      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}