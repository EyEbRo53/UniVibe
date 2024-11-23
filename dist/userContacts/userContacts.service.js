"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContactsService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const userContacts_entity_1 = require("./userContacts.entity");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/user.entity");
let UserContactsService = class UserContactsService {
    constructor(userContactsRepository, userRepository) {
        this.userContactsRepository = userContactsRepository;
        this.userRepository = userRepository;
    }
    async addContacts(user_id, contacts) {
        const userExists = await this.userRepository.findOne({ where: { user_id } });
        if (!userExists) {
            throw new common_1.NotFoundException('User not found');
        }
        const contactTypes = contacts.map(contact => contact.contact_type);
        const contactValues = contacts.map(contact => contact.contact_value);
        const existingContacts = await this.userContactsRepository.find({
            where: {
                user: { user_id },
                contact_type: (0, typeorm_2.In)(contactTypes),
                contact_value: (0, typeorm_2.In)(contactValues)
            },
        });
        const existingContactValues = existingContacts.map(contact => `${contact.contact_type}:${contact.contact_value}`);
        for (const contact of contacts) {
            if (existingContactValues.includes(`${contact.contact_type}:${contact.contact_value}`)) {
                throw new common_1.ConflictException("Contact already exists");
            }
        }
        await this.userContactsRepository.save(contacts.map(contact => ({
            user: userExists,
            contact_type: contact.contact_type,
            contact_value: contact.contact_value,
        })));
        return {
            message: 'Contacts added successfully',
        };
    }
    async getAllContacts(user_id) {
        const contacts = await this.userContactsRepository.find({
            where: { user: { user_id } },
        });
        if (!contacts) {
            throw new common_1.NotFoundException('No contacts found for this user');
        }
        return contacts;
    }
    async replaceContact(user_id, contact_id, contact_type, contact_value) {
        const replacementContact = {
            contact_type,
            contact_value
        };
        const searchingCriteria = {
            user: { user_id },
            contact_id
        };
        const result = await this.userContactsRepository.update(searchingCriteria, replacementContact);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('No contact found with the given ID for this user.');
        }
    }
    async deleteContactById(user_id, contact_id) {
        const deletionContact = {
            user: { user_id },
            contact_id
        };
        const result = await this.userContactsRepository.delete(deletionContact);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('No contact found with the given ID for this user.');
        }
    }
    async clearContactValue(user_id, contact_type) {
        const contactToClear = await this.userContactsRepository.findOne({
            where: { user: { user_id }, contact_type },
        });
        if (!contactToClear) {
            throw new common_1.NotFoundException(`Contact of type '${contact_type}' not found for this user`);
        }
        contactToClear.contact_value = null;
        await this.userContactsRepository.save(contactToClear);
        return { message: 'Contact value cleared successfully' };
    }
};
exports.UserContactsService = UserContactsService;
exports.UserContactsService = UserContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(userContacts_entity_1.UserContacts)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserContactsService);
//# sourceMappingURL=userContacts.service.js.map