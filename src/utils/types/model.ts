export interface AccountDetails {
  bank: string;
  number: string;
  name: string;
}
export enum AdminRole {
  admin = 'admin',
  superadmin = 'superadmin',
}

export enum UserStatus {
  blocked = 'blocked',
  restricted = 'restricted',
  active = 'active',
}
export enum Channel {
  APP = 'APP',
  WEB = 'WEB',
}

export enum ProductType {
  card = 'card',
  coin = 'coin',
}

export enum StudentAmbassadorStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}

export enum PaymentStatus {
  pending = 'pending',
  success = 'success',
  declined = 'declined',
}
