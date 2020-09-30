import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { Module } from '@nestjs/common';
// mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { PointSchema } from './points.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Point', schema: PointSchema }]),
  ],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
