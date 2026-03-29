export class CreateBookingDto {
  clientId!: string;
  serviceId?: string;
  staffId?: string;
  dateTime!: string;
  notes?: string;
}

export class UpdateBookingDto {
  dateTime?: string;
  status?: string;
  notes?: string;
  pricePaid?: number;
}
