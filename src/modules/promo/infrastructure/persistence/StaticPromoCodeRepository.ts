import { PromoCode } from '../../domain/PromoCode';
import { PromoCodeRepository } from '../../domain/PromoCodeRepository';

export class StaticPromoCodeRepository implements PromoCodeRepository {
  private codes: PromoCode[] = [
    new PromoCode('SAVE10', 10, new Date('2026-12-31')),
    new PromoCode('TICKETWAVE', 20, new Date('2026-12-31')),
  ];

  async findByCode(code: string): Promise<PromoCode | null> {
    return this.codes.find(c => c.code === code) || null;
  }
}
