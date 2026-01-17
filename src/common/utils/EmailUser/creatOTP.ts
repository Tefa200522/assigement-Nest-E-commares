import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { customAlphabet } from "nanoid";
import { otpEnum } from "src/DB/models/otp.modelSchema";
import { OTPRepo } from "src/DB/repo/otp.repo";
import { compareHash, createHash } from "../security/hash";


@Injectable()
export class OTPService {
    constructor( private readonly otpRepo: OTPRepo){ }
    async createOTP ({
        type = otpEnum.VERIFY_EMAIL,
        userId
    }: {
        type ?:otpEnum ,
        userId: Types.ObjectId
    }) {
        const nanoid = customAlphabet('0123456789', 6);
        const otp = nanoid();
        const isOTPExist = await this.otpRepo.findOne({
            filter:{
                userId,
                type
            }
        });
        if (isOTPExist && isOTPExist.expireIn > new Date(Date.now())) {
            throw new BadRequestException('otp already sent, send in anther time ')
        }
        if (!isOTPExist) {
            await this.otpRepo.create({
                data:{
                    userId,
                    type,
                    expireIn : new Date(Date.now() + 60 *1000),
                    otp: await createHash(otp)
                }
            })
            return otp;
        }
        else{
            isOTPExist.otp = await createHash(otp);
            isOTPExist.expireIn = new Date(Date.now() + 60 *1000);
            return otp
        }
    }


    async validateOtp ({
        otp,
        type,
        userId
    }:{
        otp: string,
        type: otpEnum,
        userId: Types.ObjectId
    }){
        const userOtp = await this.otpRepo.findOne({
            filter:{
                type,
                userId
            }
        })
        if (!userOtp) {
            throw new NotFoundException('not found otp')
        }
        if (userOtp.expireIn < new Date(Date.now())) {
            throw new BadRequestException('otp expired')
        }
        if (!await compareHash(otp,userOtp.otp as string)) {
            throw new BadRequestException('otp not correct')
        }
        await userOtp.deleteOne()
    }
}

    