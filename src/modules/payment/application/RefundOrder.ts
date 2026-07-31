export class RefundOrder {
  async execute(orderId: string, amount: number): Promise<void> {
    console.log(`Refunding order ${orderId} with amount ${amount}`);
    // Mock refund logic
  }
}
