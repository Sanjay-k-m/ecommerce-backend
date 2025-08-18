import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AddressesRepository } from '../repositories/addresses.repository';
import { CreateAddressDto, UpdateAddressDto } from '../dto/v1';
import { Address } from '@prisma/client';

@Injectable()
export class AddressesService {
  constructor(private readonly repo: AddressesRepository) {}

  async create(userId: string, dto: CreateAddressDto): Promise<Address> {
    return this.repo.create(userId, dto);
  }

  async findAll(userId: string): Promise<Address[]> {
    return this.repo.findAll({
      where: { userId, deletedAt: null },
    });
  }

  async findOne(userId: string, id: string): Promise<Address> {
    const address = await this.repo.findOne(id);
    if (!address || address.deletedAt) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }
    return address;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.repo.findOne(id);
    if (!address || address.deletedAt) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }
    return this.repo.update(id, dto);
  }

  async delete(userId: string, id: string): Promise<void> {
    const address = await this.repo.findOne(id);
    if (!address || address.deletedAt) {
      throw new NotFoundException('Address not found');
    }
    if (address.userId !== userId) {
      throw new ForbiddenException('You do not have access to this address');
    }
    await this.repo.delete(id);
  }
}
