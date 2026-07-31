export class Ticket {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly eventId: string,
    public readonly userId: string,
    public readonly seatNumber?: string,
    public readonly qrCode?: string
  ) {}
}
