import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepo } from 'src/DB/repo/coponRepo';

@Injectable()
export class CouponService {
    constructor( private readonly couponRepo:CouponRepo ){ }

    async addCoupon(data:{
        code:string,
        maxCount:number,
        discount:number,
        expireIn:Date

    }){
        const isCouponExist =await this.couponRepo.findOne({
            filter:{
                code: data.code
            }
        })
        if(isCouponExist){
            throw new BadRequestException(' coupon already exist')
        }
        console.log({ data});
        
        const coupon = await this.couponRepo.create({ data })
        
        return { data: coupon }
    }
}