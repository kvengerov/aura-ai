export class CreateServiceDto {
  name!: string;
  description?: string;
  category?: string;
  price?: number;
  durationMin!: number;
  color?: string;
}

export class UpdateServiceDto {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  durationMin?: number;
  color?: string;
  isActive?: boolean;
}
