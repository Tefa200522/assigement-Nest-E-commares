import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { SignupDTO } from "src/auth/authDTO/singup.DTO";


@Injectable()
export class CommonPipe implements PipeTransform{
    transform(value: SignupDTO, metadata: ArgumentMetadata) {
        console.log(
            value,
            metadata
        );
        
        if (value.password != value.confirmPassword) {
            throw new BadRequestException ('password not equal confirmPassword')
        }
        return value
    }
}