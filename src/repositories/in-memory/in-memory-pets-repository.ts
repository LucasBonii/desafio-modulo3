import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { FindAllParams, PetsRepository } from '../pets-repository'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository?: InMemoryOrgsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findAll(params: FindAllParams) {
    let orgsInCityIds: string[] = []

    if (this.orgsRepository) {
      orgsInCityIds = this.orgsRepository.items
        .filter((org) => org.city.toLowerCase() === params.city.toLowerCase())
        .map((org) => org.id)
    }

    const pets = this.items.filter((item) => {
      if (this.orgsRepository && !orgsInCityIds.includes(item.org_id)) {
        return false
      }

      if (params.age && item.age !== params.age) {
        return false
      }

      if (params.size && item.size !== params.size) {
        return false
      }

      if (params.energy_level && item.energy_level !== params.energy_level) {
        return false
      }

      if (
        params.independence_level &&
        item.independence_level !== params.independence_level
      ) {
        return false
      }

      return true
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      environment: data.environment,
      org_id: data.org_id,
      created_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }
}