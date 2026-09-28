import { Pet } from '@prisma/client'
import { PetsRepository } from '@/repositories/pets-repository'

interface FetchPetsUseCaseRequest {
  city: string
  age?: 'PUPPY' | 'ADULT' | 'SENIOR'
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  energy_level?: 'LOW' | 'MEDIUM' | 'HIGH'
  independence_level?: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface FetchPetsUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    age,
    size,
    energy_level,
    independence_level,
  }: FetchPetsUseCaseRequest): Promise<FetchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findAll({
      city,
      age,
      size,
      energy_level,
      independence_level,
    })

    return {
      pets,
    }
  }
}