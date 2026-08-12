export interface SendOrderConfirmationRequest {
  orderId: string;
  userId: string;
  amount: number;
}

export class SendOrderConfirmation {
  async execute(request: SendOrderConfirmationRequest): Promise<void> {
    console.log(`Notification: User ${request.userId}, your order ${request.orderId} (${request.amount}) is confirmed. Enjoy the show!`);
  }
}
