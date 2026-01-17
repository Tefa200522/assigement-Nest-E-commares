import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { HydratedDocument, Types } from "mongoose";
import { Observable } from "rxjs";
import { JWT } from "../utils/security/jwt.token";
import { UserRepo } from "src/DB/repo/userRepo";
import { User } from "src/DB/models/schema.usermodel";
export interface AuthReq extends Request{
    user : HydratedDocument<User>
}
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private readonly jwtService: JWT,
        private readonly userRepo: UserRepo
    ){ }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req:AuthReq = context.switchToHttp().getRequest()
            const auth = req.headers.authorization
            if (!auth?.startsWith(process.env.BEARER as string)) {
                throw new BadRequestException('in-valid token')
            }
            const token = auth.split(' ')[1]
            const payload:{
                _id:Types.ObjectId,
                email: string
            } = await this.jwtService.verify({
                token, options:{
                    secret: process.env.SECRET_KEY
                }
            }) 

            const user = await this.userRepo.findById({id: payload._id})

            if (!user) {
                throw new BadRequestException('user is Deleted')
            }
            if (!user.isComfirmed) {
                throw new BadRequestException('email not comfirmed')
            }
            req.user= user
            return true
        } catch (err) {
            throw new BadRequestException({ AuthErr:err })
        }
    }
}