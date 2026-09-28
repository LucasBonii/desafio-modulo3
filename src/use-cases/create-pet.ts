import { Pet } from '@prisma/client'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreatePetUseCaseRequest {
  name: string
  about: string
  age: 'PUPPY' | 'ADULT' | 'SENIOR'
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  energy_level: 'LOW' | 'MEDIUM' | 'HIGH'
  independence_level: 'LOW' | 'MEDIUM' | 'HIGH'
  environment: string
  org_id: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    org_id,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      size,
      energy_level,
      independence_level,
      environment,
      org_id,
    })

    return {
      pet,
    }
  }
}