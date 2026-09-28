import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from './register-org'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a new org', async () => {
    const { org } = await sut.execute({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password: 'password123',
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.name).toEqual('Amigos dos Pets')
  })

  it('should hash user password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password: 'password123',
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      org.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'contato@amigos.com'

    await sut.execute({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email,
      whatsapp: '46999999999',
      password: 'password123',
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    await expect(() =>
      sut.execute({
        name: 'Amigos dos Pets 2',
        author_name: 'Jane Doe',
        email,
        whatsapp: '46988888888',
        password: 'password123',
        cep: '85555000',
        state: 'PR',
        city: 'Chopinzinho',
        neighborhood: 'Centro',
        street: 'Rua Principal, 101',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})