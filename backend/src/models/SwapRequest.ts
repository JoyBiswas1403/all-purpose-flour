import { db } from '../config/database';
import { SwapRequest, SwapStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SwapRequestModel {
  static async create(swapRequest: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<SwapRequest> {
    const id = uuidv4();
    const now = new Date();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO swap_requests (id, requester_id, requester_slot_id, target_user_id, target_slot_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        id,
        swapRequest.requesterId,
        swapRequest.requesterSlotId,
        swapRequest.targetUserId,
        swapRequest.targetSlotId,
        swapRequest.status,
        now.toISOString(),
        now.toISOString()
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            requesterId: swapRequest.requesterId,
            requesterSlotId: swapRequest.requesterSlotId,
            targetUserId: swapRequest.targetUserId,
            targetSlotId: swapRequest.targetSlotId,
            status: swapRequest.status,
            createdAt: now,
            updatedAt: now
          });
        }
      });
    });
  }

  static async findById(id: string): Promise<SwapRequest | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM swap_requests WHERE id = ?';
      
      db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            requesterId: row.requester_id,
            requesterSlotId: row.requester_slot_id,
            targetUserId: row.target_user_id,
            targetSlotId: row.target_slot_id,
            status: row.status as SwapStatus,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          });
        }
      });
    });
  }

  static async findByTargetUserId(targetUserId: string): Promise<SwapRequest[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM swap_requests 
        WHERE target_user_id = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [targetUserId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            id: row.id,
            requesterId: row.requester_id,
            requesterSlotId: row.requester_slot_id,
            targetUserId: row.target_user_id,
            targetSlotId: row.target_slot_id,
            status: row.status as SwapStatus,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })));
        }
      });
    });
  }

  static async findByRequesterId(requesterId: string): Promise<SwapRequest[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM swap_requests 
        WHERE requester_id = ? 
        ORDER BY created_at DESC
      `;
      
      db.all(query, [requesterId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            id: row.id,
            requesterId: row.requester_id,
            requesterSlotId: row.requester_slot_id,
            targetUserId: row.target_user_id,
            targetSlotId: row.target_slot_id,
            status: row.status as SwapStatus,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
          })));
        }
      });
    });
  }

  static async updateStatus(id: string, status: SwapStatus): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE swap_requests 
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
}