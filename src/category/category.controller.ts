import { Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, type AuthReq } from 'src/common/guard/auth.guard';
import { storage } from 'src/common/utils/multer/upload';
import { hydratedCategory } from 'src/DB/models/categoryModel';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor( private readonly categoryService : CategoryService){}


    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',{
        storage:storage('category')
    }))

    async createCategory(@Req() req:AuthReq){
        const data:Partial<hydratedCategory> ={
            name:req.body.name,
            createdBy:req.user._id,
            image:req.file?.path 
        } 

        return {
            data: await this.categoryService.createCategory(data)
        }
    }

    @Get()
    async findAll(){
        return { 
            data: await this.categoryService.findAll()
        }
    }
}
