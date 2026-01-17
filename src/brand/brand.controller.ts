import { Controller, Patch, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { AuthGuard,type AuthReq } from "src/common/guard/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from "src/common/utils/multer/upload";
import { Brand } from "src/DB/models/brandModel";
import { Types } from "mongoose";


@Controller('brand')
export class BrandController{
    constructor(
        private readonly brandService : BrandService
    ){}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',{
        storage:storage('brands')
        
    }))
    async createBrand(@Req() req:AuthReq){
        const data: Partial <Brand> = {
            name:req.body.name,
            createdBy:req.user._id,
            image: req.file?.path as string            
        }
        const brand = await this.brandService.createBrand(data)
        return { msg:' Success', data: brand}
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image',
        {
            storage:storage('brands')
        }
    ))
    async updateBrand(@Req() req:AuthReq){
        const brandId = req.params.id as unknown as Types.ObjectId 
        const createdBy = req.user._id
        const image = req.file?.path
        const name = req.body.name
        const data = await this.brandService.updateBrand(
            brandId,
            createdBy,
            {
                image,
                name
            }
        )
        return { data }
    }

}