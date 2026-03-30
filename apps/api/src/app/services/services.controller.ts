import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { HEADERS } from '../config/constants';

@Controller('v1/services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll(@Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.servicesService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.servicesService.findOne(id, orgId);
  }

  @Post()
  create(@Headers(HEADERS.ORGANIZATION_ID) orgId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers(HEADERS.ORGANIZATION_ID) orgId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.servicesService.remove(id, orgId);
  }
}
