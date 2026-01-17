import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { UserModel } from 'src/DB/models/schema.usermodel';
import { CategoryModel } from 'src/DB/models/categoryModel';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';
import { UserRepo } from 'src/DB/repo/userRepo';
import { CategoryRepo } from 'src/DB/repo/categoryRepo';

@Module({
  imports:[UserModel,CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService ,JWT, UserRepo, CategoryRepo]
})
export class CategoryModule {}
