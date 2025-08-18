import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../../services/media.service';
import { CreateMediaDto, UpdateMediaDto, MediaIdParamDto } from '../../dto/v1';
import { JwtAuthGuard } from 'src/common/security/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/security/guards/roles.guard';
import { Roles } from 'src/common/security/decorators';
import { UserId } from 'src/common/security/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { RoleName } from '@prisma/client';

@ApiTags('Media')
@Controller({ path: 'media', version: '1' })
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.user, RoleName.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a new media file (User/Admin)' })
  @ApiResponse({ status: 201, description: 'Media created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMediaDto,
    @UserId() userId: string,
  ) {
    return this.service.create(file, { ...dto, userId });
  }

  @Get()
  @ApiOperation({ summary: 'List all active media' })
  @ApiResponse({ status: 200, description: 'List of media' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single media by ID' })
  @ApiResponse({ status: 200, description: 'Media details' })
  @ApiNotFoundResponse({ description: 'Media not found' })
  async findOne(@Param() params: MediaIdParamDto) {
    return this.service.findOne(params.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a media by ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Media updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiNotFoundResponse({ description: 'Media not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(@Param() params: MediaIdParamDto, @Body() dto: UpdateMediaDto) {
    return this.service.update(params.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.user, RoleName.admin)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a media by ID (User/Admin)' })
  @ApiResponse({ status: 204, description: 'Media deleted' })
  @ApiNotFoundResponse({ description: 'Media not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param() params: MediaIdParamDto, @UserId() userId: string) {
    return this.service.remove(params.id, userId);
  }
}
