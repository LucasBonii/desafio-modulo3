import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { GetPetDetailsUseCase } from './get-pet-details'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetDetailsUseCase(petsRepository, orgsRepository)
  })

  it('should be able to get pet details with org', async () => {
    const org = await orgsRepository.create({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password_hash: '123456',
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    const createdPet = await petsRepository.create({
      name: 'Rex',
      about: 'Cão dócil',
      age: 'PUPPY',
      size: 'MEDIUM',
      energy_level: 'HIGH',
      independence_level: 'MEDIUM',
      environment: 'Espaçoso',
      org_id: org.id,
    })

    const { pet, org: petOrg } = await sut.execute({
      id: createdPet.id,
    })

    expect(pet.id).toEqual(createdPet.id)
    expect(petOrg.whatsapp).toEqual('46999999999')
  })

  it('should not be able to get details of a non-existing pet', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existing-pet-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})