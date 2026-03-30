import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { HEADERS } from '../config/constants';

@Controller('v1/bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  findAll(@Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.bookingsService.findAll(orgId);
  }

  @Get('calendar')
  findCalendar(
    @Headers(HEADERS.ORGANIZATION_ID) orgId: string,
    @Query('start') startDate: string,
    @Query('end') endDate: string,
  ) {
    return this.bookingsService.findCalendar(orgId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.bookingsService.findOne(id, orgId);
  }

  @Post()
  create(@Headers(HEADERS.ORGANIZATION_ID) orgId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers(HEADERS.ORGANIZATION_ID) orgId: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, orgId, dto);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.bookingsService.confirm(id, orgId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.bookingsService.complete(id, orgId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.bookingsService.remove(id, orgId);
  }
}
