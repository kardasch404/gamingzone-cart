export const CART_CONSTANTS = {
  MAX_ITEMS: 20,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10,
  TTL_DAYS: 7,
  TTL_SECONDS: 604800, // 7 days
  CURRENCY: 'MAD',
  TAX_RATE: 0.0, // Morocco VAT 20%, configurable
};

export const REDIS_KEYS = {
  CART: (userId: string) => `cart:${userId}`,
};
