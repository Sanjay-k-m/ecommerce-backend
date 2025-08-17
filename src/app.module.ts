import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ThrottlerCustomModule } from './common/throttler/throttler.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // global .env config
    ThrottlerCustomModule.forRoot(), // Our throttler module
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
