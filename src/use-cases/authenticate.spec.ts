import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password_hash: await hash('password123', 6),
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    const { org } = await sut.execute({
      email: 'contato@amigos.com',
      password: 'password123',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'non-existing@amigos.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await orgsRepository.create({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato@amigos.com',
      whatsapp: '46999999999',
      password_hash: await hash('password123', 6),
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    await expect(() =>
      sut.execute({
        email: 'contato@amigos.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})