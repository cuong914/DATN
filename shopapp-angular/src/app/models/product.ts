import { ProductImage } from "./product.image";
export interface Product {
    id: number;
    name: string;
    price: number;
    numberProduct: number;
    active: boolean;
    thumbnail: string;
    description: string;
    category_id: number;
    url: string; 
    product_images: ProductImage[]; // tham chiếu đến các ảnh 
  }