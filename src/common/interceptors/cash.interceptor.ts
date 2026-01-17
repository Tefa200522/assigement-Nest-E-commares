import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import {  Observable, of, tap } from "rxjs";
import {type AuthReq } from "../guard/auth.guard";
import { RedisClientType } from "redis";




@Injectable()

export class CashInterceptor implements NestInterceptor{

    constructor(@Inject('REDIS_CLIENT') private readonly redis:RedisClientType){}
    async  intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest()
        if(req.method != 'GET'){
            return next.handle()
        }
        const key = this.generateKey(req)
        const data = await this.redis.get(key)
        if(data){
            console.log('data from cashe');
            return of(JSON.stringify(data))
        }


    return next
        .handle()
        .pipe(
           tap(async (resData)=>{
                console.log({ resData});
                const value= typeof resData == 'string' ? resData : JSON.stringify(resData)
                if(!this.redis.isOpen){
                    this.redis.connect()
                }
                await this.redis.set(key , value , {
                    expiration:{
                        type:"EX",
                        value:20
                    }
                })
                console.log(' data save to cashe');
                
           })
        );
    }

    generateKey(req:AuthReq){
        const url = req.path
        const queryPart = Object.keys(req.query ||{} ).length ? `?${JSON.stringify(req.query)}` : ''
        const userPath = req.user?._id ? `u${req.user._id}`: ''
        const key = `http-cashe${req.method}:${url}${queryPart}${userPath} `
        return key
    }
}