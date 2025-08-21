import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/generate-access-token')
  async getAccessToken(@Body() body: { name: string; roomName: string }) {
    console.log(body.name);
    return this.appService.getAccessToken(body.roomName, body.name);
  }
  @Post('/create-room')
  async createRoom(@Body('roomName') roomName: string) {
    return await this.appService.createRoom('http://localhost:7880', roomName);
  }
  @Post('/dispatch-token')
  async dispatchToken(@Body('roomName') roomName: string) {
    await this.appService.dispatchToken('kiran', roomName);
  }
}
