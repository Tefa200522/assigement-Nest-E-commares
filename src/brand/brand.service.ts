import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Brand } from "src/DB/models/brandModel";
import { BrandRepo } from "src/DB/repo/brandRepo";
import fs  from 'fs/promises'



@Injectable()
export class BrandService{
    constructor(private readonly brandRepo:BrandRepo) { }

    async createBrand(data: Partial <Brand>){
        

        const isBrandExist = await this.brandRepo.findOne({
            filter:{
                name:data.name
            }
        })
        if(isBrandExist){
            throw new BadRequestException('brand already exist')
        }
        const brand = await this.brandRepo.create({
            data
        })
        return brand
    }

    async updateBrand(brandId:Types.ObjectId, createdBy:Types.ObjectId, data:Partial<Brand>){
        
        const brand = await this.brandRepo.findOne({
            filter:{
                _id: brandId,
                createdBy
            }
        })
        if(!brand){
            throw new NotFoundException ('brand not found')
        }
         
        if( data.name && data.name !== brand.name){
            const isNameExist = await this.brandRepo.findOne({
                filter:{name : data.name}
            })
            if(isNameExist){
                throw new BadRequestException('name already inuse')
            }
            brand.name = data.name 
        }
        if(data.image ){
            if(brand.image){
                await fs.unlink(brand.image)
            }
            brand.image = data.image
        }
        await brand.save()
        return brand
    
    }
        

}
