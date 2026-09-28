import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { FetchPetsUseCase } from './fetch-pets'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: FetchPetsUseCase

describe('Fetch Pets Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new FetchPetsUseCase(petsRepository)
  })

  it('should be able to fetch pets by city', async () => {
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

    await petsRepository.create({
      name: 'Bidu',
      about: 'Cão dócil',
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'LOW',
      independence_level: 'HIGH',
      environment: 'Pequeno',
      org_id: org.id,
    })

    const { pets } = await sut.execute({
      city: 'Chopinzinho',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Bidu' })])
  })

  it('should not be able to fetch pets from another city', async () => {
    const org = await orgsRepository.create({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password_hash: '123456',
      cep: '85555000',
      state: 'PR',
      city: 'Curitiba',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    await petsRepository.create({
      name: 'Bidu',
      about: 'Cão dócil',
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'LOW',
      independence_level: 'HIGH',
      environment: 'Pequeno',
      org_id: org.id,
    })

    const { pets } = await sut.execute({
      city: 'Chopinzinho',
    })

    expect(pets).toHaveLength(0)
  })

  it('should be able to filter pets by characteristics', async () => {
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

    await petsRepository.create({
      name: 'Bidu',
      about: 'Cão dócil',
      age: 'PUPPY',
      size: 'SMALL',
      energy_level: 'LOW',
      independence_level: 'HIGH',
      environment: 'Pequeno',
      org_id: org.id,
    })

    await petsRepository.create({
      name: 'Thor',
      about: 'Cão agitado',
      age: 'ADULT',
      size: 'LARGE',
      energy_level: 'HIGH',
      independence_level: 'LOW',
      environment: 'Grande',
      org_id: org.id,
    })

    const { pets } = await sut.execute({
      city: 'Chopinzinho',
      age: 'ADULT',
      size: 'LARGE',
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Thor' })])
  })
})