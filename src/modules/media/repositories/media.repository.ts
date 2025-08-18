import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from '../dto/v1';
import { Prisma } from '@prisma/client';

type MediaWithRelations = Prisma.MediaGetPayload<{
  include: {
    product: true;
    // user: true
  };
}>;

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    args?: Prisma.MediaFindManyArgs,
  ): Promise<MediaWithRelations[]> {
    return this.prisma.media.findMany({
      ...args,
      include: {
        product: true,
        // user: true
      },
    });
  }

  async findOne(id: string): Promise<MediaWithRelations> {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: { product: true, user: true },
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async create(
    dto: CreateMediaDto & { url: string },
  ): Promise<MediaWithRelations> {
    return this.prisma.media.create({
      data: {
        url: dto.url,
        type: dto.type,
        productId: dto.productId,
        userId: dto.userId,
      },
      include: {
        product: true,
        // user: true
      },
    });
  }

  async update(id: string, dto: UpdateMediaDto): Promise<MediaWithRelations> {
    return this.prisma.media.update({
      where: { id },
      data: {
        type: dto.type,
        productId: dto.productId,
        userId: dto.userId,
      },
      include: {
        product: true,
        //  user: true
      },
    });
  }

  async delete(id: string): Promise<MediaWithRelations> {
    return this.prisma.media.delete({
      where: { id },
      include: {
        product: true,
        // user: true
      },
    });
  }
}
