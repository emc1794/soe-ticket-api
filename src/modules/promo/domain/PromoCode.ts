export class PromoCode {
  constructor(
    public readonly code: string,
    public readonly discountPercentage: number,
    public readonly expirationDate: Date,
    public readonly isActive: boolean = true
  ) {}

  isValid(): boolean {
    return this.isActive && this.expirationDate > new Date();
  }

  calculateDiscount(amount: number): number {
    return (amount * this.discountPercentage) / 100;
  }
}
