import { Injectable, NotFoundException } from '@nestjs/common';
import { HProduct } from 'src/DB/models/productModel';
import { BrandRepo } from 'src/DB/repo/brandRepo';
import { CategoryRepo } from 'src/DB/repo/categoryRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';

@Injectable()
export class ProductService {
    constructor( 
        private readonly productRepo:ProductRepo ,
        private readonly brandRepo:BrandRepo ,
        private readonly categoryRepo : CategoryRepo,

    ){}

    async createProduct(data: Partial<HProduct> ) {
        const isCategoryExists = await this.categoryRepo.findById({
            id: data.category,
        })

        const [ category , brand ] = await Promise.all([
            this.categoryRepo.findById({ 
                id: data.category
            }),
            this.brandRepo.findById({ 
                id: data.brand
            })
        ])

        if(!category){
            throw new NotFoundException('category not found')
        }
        if(!brand){
            throw new NotFoundException('brand not found')
        }
        
        return {
            data: await this.productRepo.create({ 
                data
            })
        }

    }
    // async getAllProduct(){
    //     const data = await this.productRepo.find({
    //     options:{
    //         populate:[
    //             {
    //                 path:"createdBy",
    //                 select:'name email'
    //             },
    //             {
    //                 path:"brand",
    //                 select:'name image'
    //             },
    //             {
    //                 path:"category   ",
    //                 select:'name image'
    //             },
    //     ]
    //     }})
    //         return data
        
    // }


    async getAll(){
        const data = await this.productRepo.find({})
        return {
            data:"all"
        }
    }
}
