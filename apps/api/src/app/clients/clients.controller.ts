import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Controller('v1/clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll(@Headers('x-organization-id') orgId: string) {
    return this.clientsService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.clientsService.findOne(id, orgId);
  }

  @Post()
  create(@Headers('x-organization-id') orgId: string, @Body() dto: CreateClientDto) {
    return this.clientsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.clientsService.remove(id, orgId);
  }
}
