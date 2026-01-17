import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UserModel } from 'src/DB/models/schema.usermodel';
import { ProductModel } from 'src/DB/models/productModel';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';
import { UserRepo } from 'src/DB/repo/userRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';




@Module({
  
  imports:[ UserModel, ProductModel ],
  controllers: [FavoritesController],
  providers: [FavoritesService , JwtService,JWT, UserRepo,ProductRepo]

})


export class FavoritesModule {}