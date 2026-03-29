import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Controller('v1/services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll(@Headers('x-organization-id') orgId: string) {
    return this.servicesService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.servicesService.findOne(id, orgId);
  }

  @Post()
  create(@Headers('x-organization-id') orgId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.servicesService.remove(id, orgId);
  }
}
