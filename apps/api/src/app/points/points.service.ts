import { Injectable } from '@nestjs/common';
// mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// schema model
import { Point } from './points.model';

@Injectable()
export class PointsService {
  constructor(
    @InjectModel('Point') private readonly pointModel: Model<Point>
  ) {}

  async insertPoint(
    name: string,
    lat: number,
    long: number,
    x: number,
    y: number,
    z: number
  ) {
    const point = {
      name,
      latitude: lat,
      longitude: long,
      x,
      y,
      z,
    };
    const newPoint = new this.pointModel(point);
    const result = await newPoint.save();
    return result.id as string;
  }

  async getPoints() {
    const result = await this.pointModel.find().exec();
    return result.map((point) => ({
      id: point._id,
      attributes: {
        name: point.name,
      },
      geometry: {
        longitude: point.longitude,
        latitude: point.latitude,
        x: point.x,
        y: point.y,
        z: point.z,
      },
    }));
  }
}
