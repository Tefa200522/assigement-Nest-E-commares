import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartModel } from 'src/DB/models/cart.model';
import { ProductModel } from 'src/DB/models/productModel';
import { UserModel } from 'src/DB/models/schema.usermodel';
import { CartRepo } from 'src/DB/repo/cartRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';
import { UserRepo } from 'src/DB/repo/userRepo';


@Module({
  imports:[ CartModel, ProductModel,UserModel ],
  providers: [CartService , CartRepo, ProductRepo,JwtService, JWT, UserRepo],
  controllers: [CartController ]
})
export class CartModule {}
 