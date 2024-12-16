import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartBh {
    @IsString()
    @IsNotEmpty()
    name : string;

    @IsNumber()
    product_id: number;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;
   
   

    constructor(data: any) {
        this.name = data.product.name;
        this.price = data.product.price;
        this.product_id = data.product_id;
        this.quantity = data.quantity;
        
    }
}