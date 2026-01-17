import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard, type AuthReq } from 'src/common/guard/auth.guard';
import { Types } from 'mongoose';

@Controller('favorites')
export class FavoritesController {
    constructor( 
        private readonly favoritesService:FavoritesService,
    ){}



    @Get('favorite-toggle/:id')
    @UseGuards(AuthGuard)
    async favoriteToggle(@Req() req:AuthReq){
        const user = req.user
        const productId = req.params.id

        const { msg } = await this.favoritesService.favoriteToggle({
            productId : productId as unknown as Types.ObjectId,
            user
        })
        return {
            msg
        }
        
    }
}