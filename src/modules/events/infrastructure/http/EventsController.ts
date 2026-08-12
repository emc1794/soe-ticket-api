import { Request, Response } from 'express';
import { SearchEvents } from '../../application/SearchEvents';
import { successResponse } from '../../../../shared/response';

export class EventsController {
  constructor(private searchEvents: SearchEvents) {}

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
}
