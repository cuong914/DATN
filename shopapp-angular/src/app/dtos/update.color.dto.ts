import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class UpdateColorDTO {    
    @IsString()
    @IsNotEmpty()
    name: string;
            
    constructor(data: any) {
        this.name = data.name;    
    }
}