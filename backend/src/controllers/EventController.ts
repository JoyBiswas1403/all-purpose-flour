import { Request, Response } from 'express';
import { EventModel } from '../models';
import { EventStatus, AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class EventController {
  static async createEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, startTime, endTime, status = EventStatus.BUSY } = req.body;
      const userId = req.user!.id;

      if (!title || !startTime || !endTime) {
        res.status(400).json({ error: 'Title, startTime, and endTime are required' });
        return;
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start >= end) {
        res.status(400).json({ error: 'End time must be after start time' });
        return;
      }

      const event = await EventModel.create({
        title,
        startTime: start,
        endTime: end,
        status,
        userId
      });

      res.status(201).json({
        message: 'Event created successfully',
        event: {
          id: event.id,
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          status: event.status,
          userId: event.userId
        }
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const events = await EventModel.findByUserId(userId);

      res.json({
        events: events.map(event => ({
          id: event.id,
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          status: event.status,
          userId: event.userId
        }))
      });
    } catch (error) {
      console.error('Get user events error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateEventStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user!.id;

      if (!Object.values(EventStatus).includes(status)) {
        res.status(400).json({ error: 'Invalid status' });
        return;
      }

      const event = await EventModel.findById(id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      if (event.userId !== userId) {
        res.status(403).json({ error: 'You can only update your own events' });
        return;
      }

      await EventModel.updateStatus(id, status);

      res.json({
        message: 'Event status updated successfully',
        event: {
          id: event.id,
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          status,
          userId: event.userId
        }
      });
    } catch (error) {
      console.error('Update event status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const event = await EventModel.findById(id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      if (event.userId !== userId) {
        res.status(403).json({ error: 'You can only delete your own events' });
        return;
      }

      await EventModel.delete(id);

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}