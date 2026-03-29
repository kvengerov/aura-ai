export class CreateClientDto {
  name!: string;
  email?: string;
  phone!: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
}

export class UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
}
