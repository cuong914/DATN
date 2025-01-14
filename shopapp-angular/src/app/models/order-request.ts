import { CartItem } from './cart-item';

export interface OrderRequest {
  totalMoney: number;
  amountGiven: number;
  change: number;
  items: CartItem[];
}
