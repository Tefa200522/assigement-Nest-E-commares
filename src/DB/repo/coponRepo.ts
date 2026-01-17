import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "../models/copon.model";
import { DBRepo } from "./DB.repo";




@Injectable()
export class CouponRepo extends DBRepo<Coupon>{
    constructor(@InjectModel(Coupon.name) private readonly couponModel:Model<Coupon>){
        super(couponModel)
    }

}