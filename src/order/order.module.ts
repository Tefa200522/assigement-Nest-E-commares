import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderModel, PaymentMethodEnum} from 'src/DB/models/order.model';
import { CartModel } from 'src/DB/models/cart.model';
import { UserModel } from 'src/DB/models/schema.usermodel';
import { ProductModel } from 'src/DB/models/productModel';
import { CouponModel } from 'src/DB/models/copon.model';
import { OrderRepo } from 'src/DB/repo/orderRepo';
import { CartRepo } from 'src/DB/repo/cartRepo';
import { UserRepo } from 'src/DB/repo/userRepo';
import { ProductRepo } from 'src/DB/repo/productRepo';
import { CouponRepo } from 'src/DB/repo/coponRepo';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/common/utils/security/jwt.token';
import { OrderService } from './order.service';


@Module({
  imports:[OrderModel,CartModel , UserModel , ProductModel ,CouponModel],
  controllers: [OrderController],
  providers: [OrderService ,OrderRepo ,CartRepo ,UserRepo ,ProductRepo ,CouponRepo ,JwtService , JWT ,PaymentMethodEnum]
})
export class OrderModule {}