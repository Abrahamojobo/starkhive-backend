/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostingsModule } from './job-postings/job-postings.module';
import { CompanyPostingsModule } from './company-postings/company-postings.module';
import { FreelancerPostingsModule } from './freelancer-postings/freelancer-postings.module';
import { JobPosting } from './job-postings/entities/job-posting.entity';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { RolesGuard } from './auth/guards/roles.guard';
import { PermissionService } from './auth/services/permission.service';
import { PermissionGuard } from './auth/guards/permissions.guard';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import * as dotenv from 'dotenv';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './auth/auth.module';
import { FreelancerProfileModule } from './freelancer-profile/freelancer-profile.module';
dotenv.config();

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production', '.env.test'],
    }),

    // Configure TypeORM with environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),

    // Import modules
    AuthModule,
    JobPostingsModule,
    FreelancerPostingsModule,
    CompanyPostingsModule,
    CompanyModule,
    UserModule,
    ContractModule,
    PaymentModule,
  ],
  providers: [RolesGuard, PermissionGuard, PermissionService],

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware);
  }
}