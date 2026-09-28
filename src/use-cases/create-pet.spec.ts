import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { CreatePetUseCase } from './create-pet'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a new pet', async () => {
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

    const { pet } = await sut.execute({
      name: 'Rex',
      about: 'Cão dócil e brincalhão',
      age: 'PUPPY',
      size: 'MEDIUM',
      energy_level: 'HIGH',
      independence_level: 'MEDIUM',
      environment: 'Espaçoso',
      org_id: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to create a pet with non-existing org', async () => {
    await expect(() =>
      sut.execute({
        name: 'Rex',
        about: 'Cão dócil',
        age: 'PUPPY',
        size: 'MEDIUM',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'Espaçoso',
        org_id: 'non-existing-org-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})