import { Request, Response } from 'express';
import { EventModel, SwapRequestModel } from '../models';
import { EventStatus, SwapStatus, AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SwapController {
  static async getSwappableSlots(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const swappableSlots = await EventModel.findSwappableSlots(userId);

      res.json({
        slots: swappableSlots.map(slot => ({
          id: slot.id,
          title: slot.title,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status,
          userId: slot.userId
        }))
      });
    } catch (error) {
      console.error('Get swappable slots error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createSwapRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { mySlotId, theirSlotId } = req.body;
      const requesterId = req.user!.id;

      if (!mySlotId || !theirSlotId) {
        res.status(400).json({ error: 'mySlotId and theirSlotId are required' });
        return;
      }

      // Get both slots
      const mySlot = await EventModel.findById(mySlotId);
      const theirSlot = await EventModel.findById(theirSlotId);

      if (!mySlot || !theirSlot) {
        res.status(404).json({ error: 'One or both slots not found' });
        return;
      }

      // Verify ownership of my slot
      if (mySlot.userId !== requesterId) {
        res.status(403).json({ error: 'You can only offer your own slots' });
        return;
      }

      // Verify that both slots are swappable
      if (mySlot.status !== EventStatus.SWAPPABLE) {
        res.status(400).json({ error: 'Your slot is not swappable' });
        return;
      }

      if (theirSlot.status !== EventStatus.SWAPPABLE) {
        res.status(400).json({ error: 'Target slot is not swappable' });
        return;
      }

      // Create swap request
      const swapRequest = await SwapRequestModel.create({
        requesterId,
        requesterSlotId: mySlotId,
        targetUserId: theirSlot.userId,
        targetSlotId: theirSlotId,
        status: SwapStatus.PENDING
      });

      // Update both slots to SWAP_PENDING
      await EventModel.updateStatus(mySlotId, EventStatus.SWAP_PENDING);
      await EventModel.updateStatus(theirSlotId, EventStatus.SWAP_PENDING);

      res.status(201).json({
        message: 'Swap request created successfully',
        swapRequest: {
          id: swapRequest.id,
          requesterId: swapRequest.requesterId,
          requesterSlotId: swapRequest.requesterSlotId,
          targetUserId: swapRequest.targetUserId,
          targetSlotId: swapRequest.targetSlotId,
          status: swapRequest.status
        }
      });
    } catch (error) {
      console.error('Create swap request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async respondToSwapRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const { accept } = req.body;
      const userId = req.user!.id;

      if (typeof accept !== 'boolean') {
        res.status(400).json({ error: 'accept must be a boolean' });
        return;
      }

      const swapRequest = await SwapRequestModel.findById(requestId);
      if (!swapRequest) {
        res.status(404).json({ error: 'Swap request not found' });
        return;
      }

      if (swapRequest.targetUserId !== userId) {
        res.status(403).json({ error: 'You can only respond to swap requests targeting you' });
        return;
      }

      if (swapRequest.status !== SwapStatus.PENDING) {
        res.status(400).json({ error: 'Swap request is no longer pending' });
        return;
      }

      if (accept) {
        // Accept the swap - this is the key transaction
        await SwapRequestModel.updateStatus(requestId, SwapStatus.ACCEPTED);
        
        // Swap the ownership of the slots
        await EventModel.updateUserId(swapRequest.requesterSlotId, swapRequest.targetUserId);
        await EventModel.updateUserId(swapRequest.targetSlotId, swapRequest.requesterId);
        
        // Set both slots back to BUSY
        await EventModel.updateStatus(swapRequest.requesterSlotId, EventStatus.BUSY);
        await EventModel.updateStatus(swapRequest.targetSlotId, EventStatus.BUSY);

        res.json({
          message: 'Swap request accepted successfully',
          swapRequest: {
            id: swapRequest.id,
            status: SwapStatus.ACCEPTED
          }
        });
      } else {
        // Reject the swap
        await SwapRequestModel.updateStatus(requestId, SwapStatus.REJECTED);
        
        // Set both slots back to SWAPPABLE
        await EventModel.updateStatus(swapRequest.requesterSlotId, EventStatus.SWAPPABLE);
        await EventModel.updateStatus(swapRequest.targetSlotId, EventStatus.SWAPPABLE);

        res.json({
          message: 'Swap request rejected successfully',
          swapRequest: {
            id: swapRequest.id,
            status: SwapStatus.REJECTED
          }
        });
      }
    } catch (error) {
      console.error('Respond to swap request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getIncomingRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const incomingRequests = await SwapRequestModel.findByTargetUserId(userId);

      res.json({
        requests: incomingRequests.map(request => ({
          id: request.id,
          requesterId: request.requesterId,
          requesterSlotId: request.requesterSlotId,
          targetUserId: request.targetUserId,
          targetSlotId: request.targetSlotId,
          status: request.status,
          createdAt: request.createdAt
        }))
      });
    } catch (error) {
      console.error('Get incoming requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOutgoingRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const outgoingRequests = await SwapRequestModel.findByRequesterId(userId);

      res.json({
        requests: outgoingRequests.map(request => ({
          id: request.id,
          requesterId: request.requesterId,
          requesterSlotId: request.requesterSlotId,
          targetUserId: request.targetUserId,
          targetSlotId: request.targetSlotId,
          status: request.status,
          createdAt: request.createdAt
        }))
      });
    } catch (error) {
      console.error('Get outgoing requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}