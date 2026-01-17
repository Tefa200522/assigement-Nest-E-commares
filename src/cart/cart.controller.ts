import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard, type AuthReq } from 'src/common/guard/auth.guard';


@Controller('cart')
export class CartController {
    constructor ( 
        private readonly cartService:CartService,
    ){}


    @Post('add-to-cart')
    @UseGuards(AuthGuard)
    async addToCart(@Req() req:AuthReq){
        const user = req.user
        const productData = req.body
        const { data } = await this.cartService.addToCart({

            userId:user._id,
            productData
        })

        return { data }
    }
}