import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TasksModule } from './tasks/tasks.module'
import { TypeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TasksModule,
    AuthModule
  ],
})
export class AppModule { }
