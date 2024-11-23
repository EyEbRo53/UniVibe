import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, In } from 'typeorm';
import { UserContacts } from './userContacts.entity';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserContactsService {
  constructor(
    @InjectRepository(UserContacts)
    private userContactsRepository: Repository<UserContacts>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async addContacts(
    user_id: number,
    contacts: { contact_type: string; contact_value: string }[]
  ) {
    const userExists = await this.userRepository.findOne({ where: { user_id } });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const contactTypes = contacts.map(contact => contact.contact_type);
    const contactValues = contacts.map(contact => contact.contact_value);

    const existingContacts = await this.userContactsRepository.find({
      where: {
        user: { user_id },
        contact_type: In(contactTypes),
        contact_value: In(contactValues)
      },
    });

    const existingContactValues = existingContacts.map(
      contact => `${contact.contact_type}:${contact.contact_value}`
    );

    for (const contact of contacts) {
      if (existingContactValues.includes(`${contact.contact_type}:${contact.contact_value}`)) {
        throw new ConflictException("Contact already exists");
      }
    }

    await this.userContactsRepository.save(
      contacts.map(contact => ({
        user: userExists,
        contact_type: contact.contact_type,
        contact_value: contact.contact_value,
      }))
    );

    return {
      message: 'Contacts added successfully',
    };
  }



  async getAllContacts(user_id: number): Promise<UserContacts[]> {
    const contacts = await this.userContactsRepository.find({
      where: { user: { user_id } },
    });

    if (!contacts) {
      throw new NotFoundException('No contacts found for this user');
    }
    return contacts;
  }

  async replaceContact(user_id: number, contact_id, contact_type: string, contact_value: string) {

    const replacementContact: Partial<UserContacts> = {
      contact_type,
      contact_value
    };
    const searchingCriteria: Partial<UserContacts> = {
      user: { user_id } as User,
      contact_id
    };
    const result = await this.userContactsRepository.update(searchingCriteria, replacementContact);

    if (result.affected === 0) {
      throw new NotFoundException('No contact found with the given ID for this user.');
    }
  }

  async deleteContactById(user_id: number, contact_id: number) {
    const deletionContact: Partial<UserContacts> = {
      user: { user_id } as User,
      contact_id
    };
    const result = await this.userContactsRepository.delete(deletionContact);
    if (result.affected === 0) {
      throw new NotFoundException('No contact found with the given ID for this user.');
    }
  }



  async clearContactValue(
    user_id: number,
    contact_type: string,
  ): Promise<{ message: string }> {
    const contactToClear = await this.userContactsRepository.findOne({
      where: { user: { user_id }, contact_type },
    });

    if (!contactToClear) {
      throw new NotFoundException(
        `Contact of type '${contact_type}' not found for this user`,
      );
    }

    contactToClear.contact_value = null;

    await this.userContactsRepository.save(contactToClear);

    return { message: 'Contact value cleared successfully' };
  }
}
