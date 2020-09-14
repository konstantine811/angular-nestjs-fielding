import { Injectable } from '@nestjs/common';
import { Message } from '@agro-fielding/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
