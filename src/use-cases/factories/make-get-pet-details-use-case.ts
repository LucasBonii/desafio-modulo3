import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { GetPetDetailsUseCase } from '../get-pet-details'

export function makeGetPetDetailsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const getPetDetailsUseCase = new GetPetDetailsUseCase(
    petsRepository,
    orgsRepository,
  )

  return getPetDetailsUseCase
}