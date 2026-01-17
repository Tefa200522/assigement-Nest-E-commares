import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "./schema.usermodel";
import { Product } from "./productModel";




@Schema({
     
    timestamps:true

})

export class Cart {
     
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
}
const cartSchema = SchemaFactory.createForClass( Cart )

export const CartModel = MongooseModule.forFeature([{
    name:Cart.name,
    schema:cartSchema
}])