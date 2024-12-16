import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class InsertProductDTO {
    @IsPhoneNumber()
    name: string;

    price: number;

    active :boolean;

    numberProduct: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    category_id: number;
    images: File[] = [];
    
    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
        this.numberProduct = data.numberProduct;
        this.active = data.active;
    }
}