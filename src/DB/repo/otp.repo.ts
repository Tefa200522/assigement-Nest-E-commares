import { Injectable } from "@nestjs/common";
import { DBRepo } from "./DB.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OTP } from "../models/otp.modelSchema";


@Injectable()
export class OTPRepo extends DBRepo<OTP> {
    constructor(@InjectModel(OTP.name)private readonly otpModel: Model<OTP>){
        super(otpModel)
    }

}