import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from 'src/DB/repo/cartRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';

@Injectable()
export class CartService {
    constructor (
        private readonly cartRepo:CartRepo,
        private readonly productRepo:ProductRepo,

    ){}



    async addToCart({ userId , productData}:{ 
        userId:Types.ObjectId,
        productData:{
            product:Types.ObjectId,
            quantity:number,
        }

    }){
        const product = await this.productRepo.findOne({
            filter:{
                _id:productData.product.toString(),
                stock:{
                    $gte:productData.quantity
                }
            }
        })
        if(!product){
            throw new BadRequestException( ' product not found or stock not enough ')
        }
        let userCart = await this.cartRepo.findOne({
            filter:{
                userId:userId
            }
        })
        if(!userCart){
            userCart = await this.cartRepo.create({ 
                data:{
                    userId,
                    items:[{
                        product:product._id,
                        quantity:productData.quantity
                    }]
                }
            })
        } else {
            const productIndex = userCart.items.findIndex(item=>{
                return item.product.toString() == productData.product.toString()
            })
            if(productIndex == -1){
                userCart.items.push({
                    product:product._id,
                    quantity:productData.quantity
                })
            }else{
                const foundItem = userCart.items[productIndex]
                const totalQuantity = foundItem.quantity + productData.quantity
                if(totalQuantity > product.stock){
                    userCart.items[productIndex].quantity = product.stock
                    await userCart.save()
                    throw new BadRequestException(` only available stock is ${ product.stock}`)
                }else{
                    userCart.items[productIndex].quantity = totalQuantity
                }
            }
            await userCart.save()
        } 
         return { data:userCart }
    }
}