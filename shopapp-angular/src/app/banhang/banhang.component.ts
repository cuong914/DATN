import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product';
import { ProductService } from '../service/product.service';
import { environment } from '../environments/environments';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { CartBh } from '../dtos/order/cart_bh';


@Component({
  selector: 'app-banhang',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule,NgClass,CommonModule],
  templateUrl: './banhang.component.html',
  styleUrl: './banhang.component.scss'
})
export class BanhangComponent implements OnInit{
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1; 
  maxCarts: number = 10; // Giới hạn số giỏ hàng tối đa


  products: Product[] = [];
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    ) {}

  ngOnInit() {
     this.cartService.clearCart();
    debugger
    this.productService.getAll().subscribe({
      next: (response: any) => {
        // response ở đây là một mảng sản phẩm
        const products = response; // Gán mảng sản phẩm từ response
    debugger
        // Duyệt qua danh sách sản phẩm và thêm URL ảnh
        products.forEach((product: any) => {
          // Gán URL cho thumbnail của sản phẩm
          product.url = `${environment.apiBaseurl}/products/images/${product.thumbnail}`;
        });
    debugger
        // Gán danh sách sản phẩm vào biến `products` để hiển thị lên giao diện
        this.products = products;
      },
      error: (error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    });

    this.loadCartsFromLocalStorage();
  }




  isCreatingCart: boolean = false;
  cartID: string = '';
  carts: any[] = [];
  selectedCart: any; // Thông tin giỏ hàng đã chọn
  currentCartId: number | null = null; // ID của giỏ hàng đang được chọn
  message: string = ''; // Thuộc tính để lưu thông báo
  amountGiven: number = 0; // Biến để lưu số tiền khách đưa
  change: number = 0; // Biến để lưu số tiền thừa

  // Hiển thị input để người dùng nhập mã giỏ hàng
  createCart() {
    this.isCreatingCart = true;
  }

  // Xác nhận mã giỏ hàng và lưu vào localStorage
  confirmCartID() {
    if (this.cartID) {
      if (this.carts.length >= this.maxCarts) {
        alert(`Giở hàng của bản đã tối đa `);
        return; // Ngừng nếu đã đạt giới hạn
      }

      const newCart = { id: this.cartID, items: [] };
      
      // Thêm giỏ hàng vào danh sách
      this.carts.push(newCart);

      // Lưu giỏ hàng vào localStorage với mã của nó
      this.saveCart(newCart);

      // Lưu danh sách mã giỏ hàng vào localStorage
      this.saveCartsList();

      // Reset lại input và trạng thái
      this.isCreatingCart = false;
      this.cartID = '';
    } else {
      alert('Vui lòng nhập mã giỏ hàng!');
    }
  }

  // Xóa giỏ hàng khỏi danh sách và localStorage
  removeCart(cartID: string) {
    // Xóa giỏ hàng khỏi localStorage
    localStorage.removeItem(`cart_${cartID}`);

    // Xóa giỏ hàng khỏi danh sách carts
    this.carts = this.carts.filter(cart => cart.id !== cartID);

    // Cập nhật danh sách mã giỏ hàng trong localStorage
    this.saveCartsList();
  }

  // Lưu giỏ hàng vào localStorage
  saveCart(cart: any) {
    localStorage.setItem(`cart_${cart.id}`, JSON.stringify(cart));
  }

  // Lưu danh sách mã giỏ hàng vào localStorage
  saveCartsList() {
    const cartIds = this.carts.map(cart => cart.id);
    localStorage.setItem('carts', JSON.stringify(cartIds));
  }

    // Chọn giỏ hàng và hiển thị thông tin
    selectCart(cartID: string) {
      this.selectedCart = JSON.parse(localStorage.getItem(`cart_${cartID}`) || '{}');
      return this.selectCart;
    }
  

  //   selectlocal(cartID: string): void {
  //     // Lấy giỏ hàng từ localStorage dựa vào cartID
  //     const cartData = localStorage.getItem(`cart_${cartID}`) || '{}';
  //     this.selectedCart = JSON.parse(cartData);
  //     console.log('Giỏ hàng đã chọn:', this.selectedCart);
  // }
  // Tải giỏ hàng từ localStorage
  loadCartsFromLocalStorage() {
    const savedCartIds = JSON.parse(localStorage.getItem('carts') || '[]');
    savedCartIds.forEach((id: string) => {
      const cart = JSON.parse(localStorage.getItem(`cart_${id}`) || '{}');
      this.carts.push(cart);
    });
  }

  
  
  addToCartBH(productId: number, productName: string, productPrice: number, quantity: number = 1): void {
    // Kiểm tra xem có giỏ hàng nào được chọn không
    debugger
    if (!this.selectedCart || !this.selectedCart.id) {
        console.warn('Vui lòng chọn giỏ hàng trước khi thêm sản phẩm.');
        return; // Ngưng thực hiện nếu không có giỏ hàng được chọn
    }
    debugger
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = this.selectedCart.items.find((item: CartBh) => item.product_id === productId);
      console.log('hhh',existingItem);
    if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên quantity
        existingItem.quantity += quantity; // Cập nhật số lượng
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào
        const newItem: CartBh = { product_id: productId, name: productName, price: productPrice, quantity };
        this.selectedCart.items.push(newItem); // Thêm sản phẩm mới vào giỏ hàng
    }

    // Lưu giỏ hàng đã cập nhật vào localStorage
    localStorage.setItem(`cart_${this.selectedCart.id}`, JSON.stringify(this.selectedCart));
    
    console.log('Giỏ hàng đã cập nhật:', this.selectedCart);
}


  // Hàm để hiện input nhập số lượng
  showQuantityInput(product: any): void {
    // Đặt trạng thái để hiển thị ô nhập số lượng cho sản phẩm được chọn
    product.showQuantityInput = true;
  }

  //  Hàm để xác nhận số lượng nhập vào
  confirmQuantity(product: any): void {
    // Giấu ô nhập sau khi đã xác nhận
    product.showQuantityInput = false;
    
    // Nếu người dùng nhập số lượng thì giữ lại, nếu không thì mặc định là 0
    product.enteredQuantity = product.enteredQuantity || 0;
    
    // Xử lý thêm nếu cần, ví dụ: lưu vào localStorage hoặc gửi lên backend
    console.log(`Số lượng đã nhập cho sản phẩm ${product.name}:`, product.enteredQuantity);
  }
 // Giả sử hàm này để tính tổng tiền

 getTotalPrice(): number {
  if (!this.selectedCart || !this.selectedCart.items) {
    return 0;
  }

  const total = this.selectedCart.items.reduce((total: number, item: any) => {
    return total + item.price * item.quantity;
  }, 0);

  return parseFloat(total.toFixed(2)); // Chuyển đổi thành chuỗi với 2 chữ số sau dấu phẩy và sau đó chuyển lại thành số
}

calculateInvoice(): void {
  const totalPrice = this.getTotalPrice(); // Tính tổng tiền
  const change = this.amountGiven - totalPrice; // Tính tiền thừa

  if (change >= 0) {
    alert( 'Thanh toán thành công!'); // Thông báo thành công

    // Xóa giỏ hàng khỏi localStorage
    localStorage.removeItem(`cart_${this.selectedCart.id}`); // Xóa giỏ hàng cụ thể

    // Cập nhật danh sách giỏ hàng
    this.carts = this.carts.filter(cart => cart !== this.selectedCart.id); // Xóa mã giỏ hàng khỏi danh sách

    // Cập nhật lại localStorage với danh sách giỏ hàng đã cập nhật
    localStorage.setItem('carts', JSON.stringify(this.carts)); // Cập nhật lại danh sách giỏ hàng trong localStorage

    // Xóa giỏ hàng khỏi danh sách trong ứng dụng
    this.removeCart(this.selectedCart.id); // Xóa giỏ hàng từ danh sách hiện tại trong ứng dụng

    // Reset giỏ hàng đã chọn
    this.selectedCart = null; // Hoặc bạn có thể cập nhật để chọn giỏ hàng khác nếu cần

  } else {
   alert('Thanh toán thất bại. Vui lòng kiểm tra lại số tiền!'); // Thông báo thất bại
  }

  // Reset số tiền khách đưa sau khi thanh toán
  this.amountGiven = 0; // Nếu bạn muốn reset lại số tiền khách đã nhập
}
  }


