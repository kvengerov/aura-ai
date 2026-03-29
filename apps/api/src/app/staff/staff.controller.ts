import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Controller('v1/staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Get()
  findAll(@Headers('x-organization-id') orgId: string) {
    return this.staffService.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.staffService.findOne(id, orgId);
  }

  @Post()
  create(@Headers('x-organization-id') orgId: string, @Body() dto: CreateStaffDto) {
    return this.staffService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-organization-id') orgId: string) {
    return this.staffService.remove(id, orgId);
  }
}
