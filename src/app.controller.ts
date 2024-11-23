import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserIds(): Promise<string> {
    try {
      let result = await this.appService.getUserIds();  // Fetch user IDs
      console.log("IN the app controlelr = " , result)
      // Create HTML list items for each user ID
      const html = result.map(id => `<li>${id}</li>`).join('');  // `map` creates the array, `join` combines them

      return html;  // Return the HTML list as a string
    } catch (error) {
      console.error('Error fetching user IDs:', error);  // Log the error for debugging
      throw new Error('Failed to fetch user IDs');  // Handle the error and send a response
    }
  }
}
