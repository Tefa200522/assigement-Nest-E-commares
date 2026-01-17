import { Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/multer/upload';
import { AuthGuard, type AuthReq } from 'src/common/guard/auth.guard';

@Controller('product')
export class ProductController {
    constructor( private readonly productService: ProductService) {}


    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('images',10,{
        storage: storage('products')
    }))
    async createProduct(@Req() req:AuthReq ) {
        const data = {
            ...req.body,
            createdBy:req.user._id,
            images:(req.files as Express.Multer.File[]).map(file => file.path )
        }

        const product  =  await this.productService.createProduct(data)

        return { 
            data: product.data
        }
    }
    // @Get()
    // async getAllProduct(){
    //     return { data: await this.productService.getAllProduct()}
    // }

    @Get()
    @UseInterceptors()
    async test(){
        return this .productService.getAll()
    }
}