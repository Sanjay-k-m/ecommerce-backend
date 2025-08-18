import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { Prisma, Address } from '@prisma/client';
import { CreateAddressDto, UpdateAddressDto } from '../dto/v1';

@Injectable()
export class AddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(args: Prisma.AddressFindManyArgs): Promise<Address[]> {
    return this.prisma.address.findMany(args);
  }

  async findOne(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async create(userId: string, dto: CreateAddressDto): Promise<Address> {
    if (dto.isDefault) {
      // Ensure only one default address per user
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, deletedAt: null },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.create({
      data: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        street: dto.street,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        zipCode: dto.zipCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        type: dto.type,
        isDefault: dto.isDefault || false,
        deliveryInstructions: dto.deliveryInstructions,
        label: dto.label,
        deletedAt: null,
      },
    });
  }

  async update(id: string, dto: UpdateAddressDto): Promise<Address> {
    if (dto.isDefault) {
      // Ensure only one default address per user
      const address = await this.findOne(id);
      if (!address) throw new NotFoundException('Address not found');
      await this.prisma.address.updateMany({
        where: {
          userId: address.userId,
          isDefault: true,
          deletedAt: null,
          NOT: { id },
        },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        street: dto.street,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        zipCode: dto.zipCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        type: dto.type,
        isDefault: dto.isDefault,
        deliveryInstructions: dto.deliveryInstructions,
        label: dto.label,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<Address> {
    return this.prisma.address.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
