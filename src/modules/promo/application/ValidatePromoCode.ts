import { PromoCodeRepository } from '../domain/PromoCodeRepository';

export class ValidatePromoCode {
  constructor(private promoCodeRepository: PromoCodeRepository) {}

  async execute(code: string, amount: number): Promise<{ isValid: boolean; discountAmount: number; error?: string }> {
    const promoCode = await this.promoCodeRepository.findByCode(code);

    if (!promoCode) {
      return { isValid: false, discountAmount: 0, error: 'Promo code not found' };
    }

    if (!promoCode.isValid()) {
      return { isValid: false, discountAmount: 0, error: 'Promo code expired or inactive' };
    }

    const discountAmount = promoCode.calculateDiscount(amount);

    return {
      isValid: true,
      discountAmount,
    };
  }
}
