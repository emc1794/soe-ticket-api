import { PromoCode } from './PromoCode';

export interface PromoCodeRepository {
  findByCode(code: string): Promise<PromoCode | null>;
}
