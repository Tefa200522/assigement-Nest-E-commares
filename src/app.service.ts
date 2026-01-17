import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello(){
    return ' hello from app controller';
  }
}
