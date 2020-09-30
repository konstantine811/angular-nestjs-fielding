import { Body, Controller, Post, Get } from '@nestjs/common';
// services
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}
  @Post()
  async addPoint(
    @Body('name') attrName: string,
    @Body('lat') lat: number,
    @Body('long') long: number,
    @Body('x') x: number,
    @Body('y') y: number,
    @Body('z') z: number
  ) {
    return this.pointsService.insertPoint(attrName, lat, long, x, y, z);
  }

  @Get()
  getAllPoints() {
    return this.pointsService.getPoints();
  }
}
