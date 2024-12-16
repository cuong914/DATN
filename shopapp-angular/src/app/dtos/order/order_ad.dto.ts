import { IsString, 
    IsNotEmpty, 
    IsPhoneNumber, 
    IsNumber, ArrayMinSize, 
    ValidateNested, 
    Length 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CartItemDTO } from './cart_item_dto';
export class OrderAdminDTO {
    user_id: number;
  
    fullname: string;
  
    email: string;
  
    phone_number: string;
    
    address: string;
  
    order_date :string;
    
    note: string;
    
    total_money: number;
  
    shipping_method: string;
  
    payment_method: string;
  
    coupon_code: string;
  
    status:string;
  
    cart_items: { product_id: number, quantity: number }[]; // Thêm cart_items để lưu thông tin giỏ hàng
  
    constructor(data: any) {
      this.user_id = data.user_id;
      this.fullname = data.fullname;
      this.email = data.email;
      this.phone_number = data.phone_number;
      this.address = data.address;
      this.note = data.note;
      this.total_money = data.total_money;
      this.shipping_method = data.shipping_method;
      this.payment_method = data.payment_method;
      this.coupon_code = data.coupon_code;
      this.status = data.status;
      this.order_date = data.order_date;
      this.cart_items = data.cart_items;
    }
  }