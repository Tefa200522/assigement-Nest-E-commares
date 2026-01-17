import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductModel } from 'src/DB/models/productModel';
import { UserModel } from 'src/DB/models/schema.usermodel';
import { BrandModel } from 'src/DB/models/brandModel';
import { CategoryModel } from 'src/DB/models/categoryModel';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';
import { UserRepo } from 'src/DB/repo/userRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';
import { CategoryRepo } from 'src/DB/repo/categoryRepo';
import { BrandRepo } from 'src/DB/repo/brandRepo';
import { createClient } from 'redis';

@Module({

  imports:[
    ProductModel,
    UserModel,
    BrandModel,
    CategoryModel

  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService , JWT, UserRepo, ProductRepo, CategoryRepo, BrandRepo,
      {
      provide:'REDIS_CLIENT',
      useFactory: ()=>{
        const cilent = createClient({
          url:'redis://127.0.0.1:6379'
        }) 
        cilent.connect()
        cilent.on('error',(err)=>{
          console.log(' redis connection error =>',err);
        })
        console.log('redis connected successfully');
        return cilent
      }
    }
  ]
})
export class ProductModule {}
