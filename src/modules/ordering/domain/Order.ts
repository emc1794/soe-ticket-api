export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly eventId: string,
    public readonly amount: number,
    public status: OrderStatus,
    public readonly createdAt: Date,
    public readonly seatNumbers: string[] = [],
    public readonly appliedPromoCode?: string,
    public readonly discountedAmount: number = 0
  ) {}

  static create(
    id: string, 
    userId: string, 
    eventId: string, 
    amount: number, 
    seatNumbers: string[] = [],
    promoCode?: string,
    discountedAmount: number = 0
  ): Order {
    return new Order(
      id, 
      userId, 
      eventId, 
      amount, 
      OrderStatus.PENDING, 
      new Date(), 
      seatNumbers,
      promoCode,
      discountedAmount
    );
  }

  markAsPaid(): void {
    this.status = OrderStatus.PAID;
  }
}
