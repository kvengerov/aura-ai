import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Controller('v1/bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  findAll(@Headers('x-organization-id') orgId: string) {
    return this.bookingsService.findAll(orgId);
  }

  @Get('calendar')
  findCalendar(
    @Headers('x-organization-id') orgId: string,
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    return this.bookingsService.findCalendar(orgId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.bookingsService.findOne(id, orgId);
  }

  @Post()
  create(@Headers('x-organization-id') orgId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, orgId, dto);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.bookingsService.confirm(id, orgId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.bookingsService.complete(id, orgId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.bookingsService.remove(id, orgId);
  }
}
