import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class UpdateSizeDTO {    
    @IsString()
    @IsNotEmpty()
    name: string;
            
    constructor(data: any) {
        this.name = data.name;    
    }
}