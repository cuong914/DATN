import {
    IsString, 
    IsNotEmpty, 
    IsPhoneNumber,     
} from 'class-validator';

export class InsertColorDTO {    
    @IsString()
    @IsNotEmpty()
    name: string;
            
    constructor(data: any) {
        this.name = data.name;    
    }
}