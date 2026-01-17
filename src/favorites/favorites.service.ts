import { Injectable, NotFoundException } from "@nestjs/common"
import { HydratedDocument, Types } from "mongoose"
import { User } from "src/DB/models/schema.usermodel"
import { ProductRepo } from "src/DB/repo/productRepo"
import { UserRepo } from "src/DB/repo/userRepo"




@Injectable()
export class FavoritesService {
    constructor(
        private readonly userRepo:UserRepo,
        private readonly productRepo:ProductRepo,
    ){ }


    async favoriteToggle({
        productId ,
        user
    }:{
        productId:Types.ObjectId,
        user: HydratedDocument<User>,

    }){
        const product = await this.productRepo.findById({ id: productId})

        if(!product){
            throw new NotFoundException(" product not found ")
        }
        const index = user.favorites.findIndex(prod => {
            return prod.toString() == productId.toString()
        })
        if(index == -1 ){
            user.favorites.push(productId)
             await user.save()
            return {
                msg:" added to favorites"
            }

        }else{
            user.favorites.splice( index , 1)
             await user.save()
            return {
                msg:" removed from favorites"
            }
        }
       

    }
}