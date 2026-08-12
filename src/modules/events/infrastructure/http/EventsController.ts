import { Request, Response, NextFunction } from 'express';
import { SearchEvents } from '../../application/SearchEvents';
import { CancelEvent } from '../../application/CancelEvent';
import { successResponse } from '../../../../shared/response';

export class EventsController {
  constructor(
    private searchEvents: SearchEvents,
    private cancelEvent: CancelEvent
  ) {}

  async search(req: Request, res: Response) {
    const { city, artist, startDate, endDate } = req.query;
    const events = await this.searchEvents.execute({
      city: city as string,
      artist: artist as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.status(200).json(successResponse(events));
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      await this.cancelEvent.execute(req.params.id as string);
      res.status(200).json(successResponse({}, 'Event cancelled successfully'));
    } catch (error) {
      next(error);
    }
  }
}
