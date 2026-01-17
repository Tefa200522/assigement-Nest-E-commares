import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from './coupon.service';



@Controller('coupon')
export class CouponController {
    constructor( private readonly cpouponService:CouponService ){}

    @Post('/add-coupon')
    async addCoupon(@Body() body){
        const { data } = await this.cpouponService.addCoupon(body)
        return { data }
    }
}