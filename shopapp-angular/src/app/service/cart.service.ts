import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Map<number, number> = new Map<number, number>(); // Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm, value là số lượng
  private cartItemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); // BehaviorSubject để thông báo số lượng sản phẩm giỏ hàng

  constructor() {
    this.refreshCart();
  }

  // Refresh giỏ hàng khi bắt đầu
  public refreshCart(): void {
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      try {
        const cartData = JSON.parse(storedCart);
        if (Array.isArray(cartData)) {
          this.cart = new Map<number, number>(cartData);
        } else {
          this.cart = new Map<number, number>();
        }
      } catch (e) {
        console.error('Lỗi khi đọc giỏ hàng từ localStorage:', e);
        this.cart = new Map<number, number>();
      }
    } else {
      this.cart = new Map<number, number>();
    }
    this.updateCartItemCount(); // Cập nhật lại số lượng giỏ hàng
  }

  // Lấy key cho giỏ hàng từ localStorage
  private getCartKey(): string {
    const userResponseJSON = localStorage.getItem('user');
    const userResponse = userResponseJSON ? JSON.parse(userResponseJSON) : null;
    if (userResponse && userResponse.id) {
      return `cart:${userResponse.id}`;
    } else {
      return 'cart:guest';
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      this.cart.set(productId, quantity);
    }
    this.saveCartToLocalStorage();
    this.updateCartItemCount(); // Cập nhật số lượng sau khi thay đổi giỏ hàng
  }

  // Lấy giỏ hàng
  getCart(): Map<number, number> {
    return this.cart;
  }

  // Lưu giỏ hàng vào localStorage
  private saveCartToLocalStorage(): void {
    try {
      localStorage.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
    } catch (e) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', e);
    }
  }

  // Cập nhật số lượng giỏ hàng
  private updateCartItemCount(): void {
    const itemCount = Array.from(this.cart.values()).reduce((acc, quantity) => acc + quantity, 0);
    this.cartItemCountSubject.next(itemCount); // Cập nhật số lượng vào BehaviorSubject
  }

  // Lấy số lượng sản phẩm trong giỏ hàng
  getCartItemCount(): number {
    return this.cartItemCountSubject.value;
  }

  // Observable để theo dõi số lượng giỏ hàng
  getCartItemCount$() {
    return this.cartItemCountSubject.asObservable();
  }

  // Xóa giỏ hàng
  clearCart(): void {
    this.cart.clear();
    this.saveCartToLocalStorage();
    this.updateCartItemCount(); // Cập nhật lại số lượng sau khi xóa giỏ hàng
  }

  // Cập nhật lại giỏ hàng từ Map
  setCart(cart: Map<number, number>): void {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
    this.updateCartItemCount(); // Cập nhật số lượng sau khi thay đổi giỏ hàng
  }
}
