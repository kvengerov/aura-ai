export class RegisterDto {
  email!: string;
  password!: string;
  organizationName!: string;
  organizationSlug?: string;
  name?: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}
