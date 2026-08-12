export interface IssueDigitalPassRequest {
  orderId: string;
  userId: string;
}

export interface DigitalPass {
  passId: string;
  orderId: string;
  userId: string;
}

export class IssueDigitalPass {
  async execute(request: IssueDigitalPassRequest): Promise<DigitalPass> {
    const passId = `PASS-${request.orderId}`;
    console.log(`[Identity Module] Issuing digital pass ${passId} to user ${request.userId} for order ${request.orderId}`);
    return { passId, orderId: request.orderId, userId: request.userId };
  }
}
