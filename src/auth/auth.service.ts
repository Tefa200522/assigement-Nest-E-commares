import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../DB/models/schema.usermodel";
import { Model } from "mongoose";
import { UserRepo } from "src/DB/repo/userRepo";
import { OTPService } from "src/common/utils/EmailUser/creatOTP";
import { otpEnum } from "src/DB/models/otp.modelSchema";
import { EMAIL_EVENTS_ENUM, emailEmitter } from "src/common/utils/EmailUser/email.events";
import { template } from "src/common/utils/EmailUser/generateHTML";
import { compareHash, createHash } from "src/common/utils/security/hash";
import { JWT } from "src/common/utils/security/jwt.token";


@Injectable()
export class AuthService {
    constructor(private readonly userRepo:UserRepo ,
        private readonly otpService :OTPService,
        private readonly JWT :JWT
    ){}


    async signup (data : User){
        const {email , name, password , age , gender} = data
        const IsEmailExist = await this.userRepo.findByEmail(email)
        if (IsEmailExist) {
            throw new BadRequestException ('Email already exict')
        }
        const user = await this.userRepo.create({
            data:{
                name,
                email,
                password: await createHash(password),
                age,
                gender,
            }
        })
        const otp = await this.otpService.createOTP({
            userId: user._id,
            type: otpEnum.VERIFY_EMAIL
        });
        const html = template({
            code:otp,
            subject: "verify your email",
            name: user.name
        })
        emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL , { 
            to: email,
            subject:"verify your email",html})
        return {data:user};
    }

    async confirmEmail(data:{
        otp: string,
        email :string 
    }){
        const IsEmailExist = await this.userRepo.findByEmail(data.email)
        if (!IsEmailExist) {
            throw new NotFoundException('email not found')
        }
        await this.otpService.validateOtp({
            otp: data.otp,
            userId: IsEmailExist._id,
            type: otpEnum.VERIFY_EMAIL
        })
        IsEmailExist.isComfirmed = true
        await IsEmailExist.save()
        return {
            msg :"success",
            data:{}
        }
    }

    async resendOtp (data:{
        email: string
    }){
        const IsEmailExist = await this.userRepo.findByEmail(data.email)
        if (!IsEmailExist) {
            throw new NotFoundException('email not found')
        }
        if (IsEmailExist.isComfirmed) {
            throw new BadRequestException('email is verifay')
        }
        const otp = await this.otpService.createOTP({
            type:otpEnum.VERIFY_EMAIL,
            userId:IsEmailExist._id
        })
        const html = template({
            code:otp,
            subject: "verify your email",
            name: IsEmailExist.name
        })
        emailEmitter.publish(EMAIL_EVENTS_ENUM.VERIFY_EMAIL , { 
            to: IsEmailExist.email,
            subject:"verify your email",html})
        
        return{
            msg:'Done',
            data:{}
        }    
    }

    async login ({email ,password}:{
        email: string,
        password: string
    }){
        const user = await this.userRepo.findByEmail(email)
        if (!user) {
            throw new BadRequestException('in-valid cradentials')
        }
        if (!await compareHash(password,user.password)) {
            throw new BadRequestException('in-valid credentials')
        }

        const payload ={
            _id: user._id,
            email: user.email
        }
        const token = this.JWT.sign({
            payload,
            options:{
                expiresIn : "15 m",
                secret: process.env.SECRET_KEY
            }
        })
        return{
            data:{
                token
            }
        }
    }
}