import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponModel } from 'src/DB/models/copon.model';
import { CouponRepo } from 'src/DB/repo/coponRepo';

@Module({
  imports:[CouponModel],
  providers: [CouponService, CouponRepo],
  controllers: [CouponController]
})

export class CouponModule { }