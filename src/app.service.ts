import { Injectable } from '@nestjs/common';
const { getAllUserIds } = require('../sql/connection');

@Injectable()
export class AppService {
  async getUserIds(): Promise<string[]> {  // Ensure the return type is an array of strings
    try {
      const userIdsArray = await getAllUserIds();  // Wait for the promise to resolve

      // Extract `id` from each object in the array
      const userIds = userIdsArray.map(user => user.id);  // This will extract the `id` from each object
      
      return userIds;  // Return the array of user IDs
    } catch (error) {
      console.error('Error fetching user IDs:', error);  // Log the error for debugging
      throw new Error('Failed to fetch user IDs');  // Handle any errors
    }
  }
}
