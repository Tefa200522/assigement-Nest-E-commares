import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatusEnum, PaymentMethodEnum } from 'src/DB/models/order.model';
import { Product } from 'src/DB/models/productModel';
import { User } from 'src/DB/models/schema.usermodel';
import { CartRepo } from 'src/DB/repo/cartRepo';
import { OrderRepo } from 'src/DB/repo/orderRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
    constructor (
        private readonly orderRepo:OrderRepo,
        private readonly cartRepo:CartRepo,
        private readonly productRepo:ProductRepo,
        private readonly paymentService:PaymentMethodEnum,
    ){}


    async createOrder({
        userId,
        discount,
        instructions,
        address,
        phone,
        payment,
     } : {
        userId:Types.ObjectId,
        discount:number,
        instructions:string[],
        address:string,
        phone:string,
        payment: PaymentMethodEnum,



    }){
        const cart = await this.cartRepo.findOne({
            filter:{
                userId
            },
            options:{
                populate:[
                    {
                        path:'items.product',
                        select: 'salePrice stock'
                    }
                ]
            }
        })
        if(!cart || cart.items.length == 0){
            throw new BadRequestException(' cart is empty')
        }

        let supTotal = cart.items.reduce((totalPrice, item) => {
        const product = item.product as unknown as Product;

        const price = Number(product.salePrice) || 0;
        const quantity = Number(item.quantity) || 0;

        return totalPrice + price * quantity;
        }, 0);

        if (isNaN(supTotal)) {
            throw new BadRequestException('Invalid subtotal calculation');
            }


        console.log({ supTotal});
        
        for ( const item of cart.items){
            await this.productRepo.updateOne({
                filter:{
                    _id:item.product
                },
                update:{
                    $inc:{
                        stock:-item.quantity
                    }
                }
            })
        }
        const order = await this.orderRepo.create({
            data:{
                discount,
                address,
                payment,
                phone,
                instructions,
                items:cart.items,
                supTotal,
                userId
            }
        })
        await cart.updateOne({ items: []})
        return {data : order }
    }


    async CreateCheckoutSction(orderId:Types.ObjectId , userId:Types.ObjectId){
        const order = await this.orderRepo.findOne({
            filter:{
                _id:orderId,
                user:userId,
                orderStatus:OrderStatusEnum.PROCESSING,
                
            },
            options:{
                populate:[ {path:'user'} , {path:'cart'} ,{ path:'coupon'} ]
            }
        }) 

        if(!order){
            throw new NotFoundException(' Order not Found ')
        }
        const amount = order.total ?? order.supTotal ?? 0 ;
        const line_items =  [{
            price_data:{
                currency:'egp',
                product_data:{
                    name:`Order ${(order.userId as unknown as HydratedDocument<User>).name }`,
                    discription:` Payment for order on Address ${order.address}`
                },
                unit_amount:amount * 100 ,
            },
            quantity:1, 
        }];

        let discounts:Stripe.Checkout.SessionCreateParams.Discount[] = []
        if(order.discount){
            const coupon = await this.paymentService.createCoupon({
                duration:'once',
                currency:'egp',
                percent_off:order.discount,
            })
            discounts.push({coupon:coupon.id})
        }

    
        const session = await this.paymentService.checkoutSction({
            customer_email:(order.userId as unknown as HydratedDocument<User>).email,
            line_items:line_items,
            mode:"payment",
            discounts,
            metadata:{ orderId:orderId.toString()},
        })

        const method =await this.paymentService.createPaymentMethod({
            type:'card',
            card:{token: "token_visa"}
        });

        const intent = await this.paymentService.createPaymentIntent({
            amount:order.supTotal * 100 ,
            currency:"egp",
            payment_method:method.id,
            payment_method_types:[PaymentMethodEnum.CARD]
        })

        order.intentId = intent.id;
        await order.save();

        await this.paymentService.confirmPaymentIntent(intent.id)

        return session

    }


    async refoundOrder(orderId:Types.ObjectId , userId:Types.ObjectId){ 
                const order = await this.orderRepo.findOne({
            filter:{
                _id:orderId,
                user:userId,
                orderStatus:OrderStatusEnum.PROCESSING,   
            }
        })
        if(!order){
            throw new NotFoundException(' Order not Found ')
        }
        if(!order.intentId){
            throw new BadRequestException(' No payment intent for this order')
        }

        const refound = await this.paymentService.createRefound(order.intentId)

        await this.orderRepo.findByIdAndUpdate({
        id: orderId,
        update: {
            $set: {
            orderStatus: OrderStatusEnum.CANCELED,
            refundId: refound.id,
            refundedAt: new Date(),
            intentId: true,
            },
            $inc: { __v: 1 }
            
        },
        }
    );
        return order

    }
}