import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { FindAllParams, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findAll({
    city,
    age,
    size,
    energy_level,
    independence_level,
  }: FindAllParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city: {
            equals: city,
            mode: 'insensitive',
          },
        },
        age,
        size,
        energy_level,
        independence_level,
      },
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}