import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from '../../users.service';
import { UpdateProfileDto, UpdateRoleDto, UserIdParamDto } from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { Roles } from 'src/common/security/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserId } from 'src/common/security/decorators';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@UserId() userId: string) {
    return this.service.getProfile(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@UserId() userId: string, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (Admin)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll() {
    return this.service.findAll();
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user roles (Admin)' })
  @ApiResponse({ status: 200, description: 'User roles updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateRole(
    @Param() params: UserIdParamDto,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.updateRole(params.id, dto);
  }
}
