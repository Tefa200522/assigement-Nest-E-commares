import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./schema.usermodel";
import { Product } from "./productModel";

export enum PaymentMethodEnum {
  CARD = "card",
  CASH = "cash",
}

type Provider = PaymentMethodEnum;

const provider: Provider = PaymentMethodEnum.CARD;


export enum OrderStatusEnum {
    PENDING =  'pending',
    PROCESSING = 'processing',
    SHIPPING = 'shipping',
    DELIVERE = 'delivere',
    CANCELED = 'canceld'
}

@Schema({
    timestamps:true
})

export class Order{

    @Prop({
        type:Types.ObjectId,
        required:true,
        unique:true,
        ref:User.name,
    })
    userId:Types.ObjectId

    @Prop({
        type:[
            {
                product :{
                    type:Types.ObjectId,
                    ref:Product.name,
                    require:true,
                }, 
                quantity:{
                    type:Number,
                    default:1

                }   
            }
        ],
        default:[]

    })
    items:{
        product:Types.ObjectId,
        quantity:number
    }[]

    @Prop({
        type:Number,
        required:true,
        default:0

    })
    supTotal:number
    @Prop({
        type:Number,
        required:false,
        default:0

    })
    discount:number

    @Prop({
        type:Number,
        required:true,
        default:0

    })
    total:number

    @Prop({
        type:String,
        required:true,
    })
    address:string

    @Prop({
        type:[String],
        
    })
    instructions: string[]
    @Prop({
        type:String,
        required:true,
    })
    phone:string

    @Prop({
        type:String,
        enum:Object.values(PaymentMethodEnum)
    })
    payment: PaymentMethodEnum

    @Prop({
        type:String,
        enum:Object.values(OrderStatusEnum),
        default:OrderStatusEnum.PROCESSING
    })
    orderStatus:OrderStatusEnum

    @Prop({
        type:String,
    })
    intentId:string
    @Prop({
        type:String,
    })
    refoundId:string
    @Prop({
        type:Date,
    })
    refoundAt:Date
}
const orderSchema = SchemaFactory.createForClass( Order )

export const OrderModel = MongooseModule.forFeature([
    {
        name:Order.name,
        schema:orderSchema
    }
])