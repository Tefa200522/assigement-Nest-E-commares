import { IsEmail, IsInt, IsString, IsStrongPassword, Max, Min } from "class-validator"


export class SignupDTO{

    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsStrongPassword({
        minLength:10,
        minSymbols:1,
        minNumbers:3,
        minLowercase:4,
        minUppercase:2
    })
    password: string

    @IsStrongPassword()
    confirmPassword: string
    
    @IsInt({})
    @Min(16)
    @Max(60)
    age : number



}