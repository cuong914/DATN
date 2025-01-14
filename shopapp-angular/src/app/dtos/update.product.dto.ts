import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UpdateProductDTO {
    @IsPhoneNumber()
    name: string;

    // size: string;

    color_id: number;


    price: number;

    active :boolean;

    numberProduct: number;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    category_id: number;

    size_id: number;

    constructor(data: any) {
        this.name = data.name;
        this.price = data.price;
        this.description = data.description;
        this.category_id = data.category_id;
        this.numberProduct = data.numberProduct;
        this.active = data.active;
        this.size_id= data.size_id;
        this.color_id = data.color_id;
    }
}