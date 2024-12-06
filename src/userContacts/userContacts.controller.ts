import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  UseGuards,
  Request,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';

import { UserContacts } from './userContacts.entity';
import { UserContactsService } from './userContacts.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';

@Controller('contacts')
export class UserContactController {
  constructor(
    private readonly contactsService: UserContactsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getContacts(@Request() req: Request) {
    const user: Partial<User> = await this.authService.identifyUser(
      req.headers['authorization'],
    );

    const contacts: UserContacts[] = await this.contactsService.getAllContacts(
      user.user_id,
    );

    return {
      message: 'Retrieved User Contacts',
      contacts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add-contacts')
  async addContacts(
    @Request() req: Request,
    @Body('contacts')
    contacts: { contact_type: string; contact_value: string }[],
  ) {
    console.log(req.headers['authorization']);

    const user: Partial<User> = await this.authService.identifyUser(
      req.headers['authorization'],
    );

    if (!Array.isArray(contacts) || contacts.length === 0) {
      throw new BadRequestException('Invalid or empty contacts list');
    }
    for (const contact of contacts) {
      const { contact_type, contact_value } = contact;

      if (!contact_type || !contact_value) {
        throw new BadRequestException(
          'Each contact must have a type and value',
        );
      }
    }
    await this.contactsService.addContacts(user.user_id, contacts);
    return {
      message: 'Contacts added successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/replace-contact')
  async replaceContact(
    @Request() req: Request,
    @Body('contact_id') contact_id: number,
    @Body('contact_type') contact_type: string,
    @Body('contact_value') contact_value: string,
  ) {
    const user: Partial<User> = await this.authService.identifyUser(
      req.headers['authorization'],
    );

    if (!contact_type || !contact_value || !contact_id)
      throw new BadRequestException('Parameters are invalid');
    const result = await this.contactsService.replaceContact(
      user.user_id,
      contact_id,
      contact_type,
      contact_value,
    );

    return {
      message: 'Contact updated Successfully',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/delete-contact')
  async deleteContact(
    @Request() req: Request,
    @Query('contact_id') contact_id: number,
  ) {
    // Ensure contact_id is provided
    if (!contact_id) {
      throw new BadRequestException('Contact Id is missing');
    }

    // Identify the user based on the authorization token
    const user: Partial<User> = await this.authService.identifyUser(
      req.headers['authorization'],
    );

    // Delete the contact
    const result = await this.contactsService.deleteContactById(
      user.user_id,
      contact_id,
    );

    // Return success response
    return {
      message: 'Contact deleted Successfully',
    };
  }
}
