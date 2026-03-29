export class CreateStaffDto {
  userId?: string;
  role!: string;
  specialties?: string[];
  bio?: string;
  schedule?: object;
  commissionPct?: number;
}

export class UpdateStaffDto {
  role?: string;
  specialties?: string[];
  bio?: string;
  schedule?: object;
  commissionPct?: number;
  isActive?: boolean;
}
