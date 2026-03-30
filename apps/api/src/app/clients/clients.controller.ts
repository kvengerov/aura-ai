import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { HEADERS } from '../config/constants';

@Controller('v1/clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll(@Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.clientsService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.clientsService.findOne(id, orgId);
  }

  @Post()
  create(@Headers(HEADERS.ORGANIZATION_ID) orgId: string, @Body() dto: CreateClientDto) {
    return this.clientsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers(HEADERS.ORGANIZATION_ID) orgId: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers(HEADERS.ORGANIZATION_ID) orgId: string) {
    return this.clientsService.remove(id, orgId);
  }
}
