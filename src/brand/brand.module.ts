import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { UserModel } from "src/DB/models/schema.usermodel";
import { JwtService } from "@nestjs/jwt";
import { JWT } from "src/common/utils/security/jwt.token";
import { UserRepo } from "src/DB/repo/userRepo";
import { BrandModel } from "src/DB/models/brandModel";
import { BrandRepo } from "src/DB/repo/brandRepo";



@Module({
    imports :[
        UserModel,
        BrandModel
    ],
    providers: [BrandService, JwtService, JWT ,UserRepo,BrandRepo ],
    controllers: [BrandController]
})
export class BrandModule{}