import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { StorageProviderService } from 'src/common/providers/storage-provider.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from '../dto/v1';
import { Prisma, RoleName } from '@prisma/client';

type MediaWithRelations = Prisma.MediaGetPayload<{
  include: {
    product: true;
    //  user: true
  };
}>;

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    private readonly storage: StorageProviderService,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    file: Express.Multer.File,
    dto: CreateMediaDto,
  ): Promise<MediaWithRelations> {
    if (!file) throw new BadRequestException('File not provided');

    // Validate media type
    const isImage = file.mimetype.startsWith('image');
    const isVideo = file.mimetype.startsWith('video');
    if (!isImage && !isVideo) {
      throw new BadRequestException('File must be an image or video');
    }
    if (dto.type === 'image' && !isImage) {
      throw new BadRequestException(
        'File type does not match specified media type',
      );
    }
    if (dto.type === 'video' && !isVideo) {
      throw new BadRequestException(
        'File type does not match specified media type',
      );
    }

    // Upload file to storage
    const folder = dto.productId
      ? `products/${dto.productId}`
      : `users/${dto.userId}`;
    const url = await this.storage.upload(file, folder);

    // Create media record
    return this.repo.create({ ...dto, url });
  }

  async findAll(): Promise<MediaWithRelations[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<MediaWithRelations> {
    return this.repo.findOne(id);
  }

  async update(id: string, dto: UpdateMediaDto): Promise<MediaWithRelations> {
    return this.repo.update(id, dto);
  }

  async remove(id: string, userId: string): Promise<void> {
    const media = await this.repo.findOne(id);

    // Check if user is authorized to delete
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isAdmin = user.userRoles.some(
      (ur) => ur.role.name === RoleName.admin,
    );
    if (!isAdmin && media.userId !== userId) {
      throw new ForbiddenException('You can only delete your own media');
    }

    // Delete file from storage
    const key = media.url.replace(/^\/uploads\//, '');
    await this.storage.delete(key);

    // Delete media record
    await this.repo.delete(id);
  }
}
