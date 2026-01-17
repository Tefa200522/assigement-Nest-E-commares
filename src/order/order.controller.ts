import { BadRequestException, Controller, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard,type AuthReq } from 'src/common/guard/auth.guard';
import type { Types } from 'mongoose';
import { CouponRepo } from 'src/DB/repo/coponRepo';

@Controller('order')
export class OrderController {
    constructor (
        private readonly orderService:OrderService,
        private readonly couponRepo:CouponRepo
    ){}

    
    
    @Post('create-order')
    @UseGuards(AuthGuard)
    async createOrder(@Req() req:AuthReq){
        const userId = req.user._id
        const code = req.body.coupon
        let discount = 0
        if(!code){
           const coupon = await this.couponRepo.findOne({
                filter:{
                    code:code
                }
            })
            if(!coupon){
                throw new NotFoundException('Invalid coupon')
            }
            if(new Date(Date.now()) > coupon?.expireIn || coupon.maxCount == coupon.totalUses){
                throw new BadRequestException(' coupon expired')
            }
            discount = coupon.discount
            coupon.totalUses +=1
            await coupon.save()
        }
        const { data } =await this.orderService.createOrder({
            userId,
            address:req.body.address,
            discount,
            instructions:req.body.instructions,
            payment:req.body.payment,
            phone:req.body.phone,
        })
        return { data }
    }

    @Post('checkout/:orderId')
    @UseGuards(AuthGuard)
    async createCheckoutSession(
        @Param('orderId') orderId:Types.ObjectId,
        @Req() req:AuthReq 

    ){
        const userId = req.user._id
        const session = await this.orderService.CreateCheckoutSction(
            orderId,
            userId
        )
        return session

    }


    @Post('refound/:orderId')
    @UseGuards(AuthGuard)
    async refoundOrder(
        @Param('orderId') orderId:Types.ObjectId,
        @Req() req:AuthReq 

    ){
        const userId = req.user._id
        const refound = await this.orderService.refoundOrder(
            orderId,
            userId
        )
        return refound

    }
}