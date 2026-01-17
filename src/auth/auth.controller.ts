import { Body, Controller, Get, ParseIntPipe, Post, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CommonPipe } from "src/common/pipes/test.pipe";
import { SignupDTO } from "./authDTO/singup.DTO";
import { zodPipe } from "src/common/pipes/zod.pipe";
import { signupSchema } from "./authValidation/signup.schema.validation";
import { User } from "src/DB/models/schema.usermodel";
import { AuthGuard } from "src/common/guard/auth.guard";
import {  SuccessHandlerInterseptor } from "src/common/interceptors/morgan.interceptor";



@Controller('auth')
export class AuthController {
    constructor( private readonly authService:AuthService){}

    @Post('signup')
    @UsePipes(new zodPipe(signupSchema))
    async signup (@Body() data : User){
        return this.authService.signup(data)
    }


    @Post('confirmEmail')
    async confirmEmail(@Body() {otp,email}:{
        otp: string,
        email: string
    }){
        return this.authService.confirmEmail({otp,email})
    }


    @Post('resend-Otp')
    async resendOtp(@Body() {email}:{
        email:string
    }){
        return this.authService.resendOtp({email})
    }

    @Post('login')
    async login(@Body() {email, password}:{ email:string, password: string}){
        return this.authService.login({email, password})
    }


    @Get('me')
    @UseGuards(AuthGuard)
    @UseInterceptors(SuccessHandlerInterseptor)
    async me (@Req() {user}){
        console.log("innnnn");
        
        return {data: user}
    }
}