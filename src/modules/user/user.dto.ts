import { User } from './user.entity';

export class DAuthenticatedUser {
  id: number;
  name: string;
  email: string;
  token: string;
  role: string;
  impersonatedBy?: number;
  created?: boolean;

  constructor(
    user: User,
    token: string,
    created: boolean = false,
    impersonatedBy: number = undefined,
  ) {
    this.id = user.id;
    this.name = user.fullName;
    this.email = user.email || user.unverifiedEmail;
    this.token = token;
    this.role = user.role;
    this.impersonatedBy = impersonatedBy;
    this.created = created;
  }
}

export class DUserProfile {
  id: number;
  email: string;
  profileImageUrl: string;
  role: string;

  name: string;
  surname: string;
  phone: string;
  description: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email || user.unverifiedEmail;
    this.profileImageUrl = user.profileImage.url;
    this.role = user.role;

    this.name = user.profile.name;
    this.surname = user.profile.surname;
    this.phone = user.profile.phone;
    this.description = user.profile.description;
  }
}
