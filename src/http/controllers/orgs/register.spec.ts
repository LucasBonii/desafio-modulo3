import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'Amigos dos Pets',
      author_name: 'John Doe',
      email: 'contato-register@amigos.com',
      whatsapp: '46999999999',
      password: 'password123',
      cep: '85555000',
      state: 'PR',
      city: 'Chopinzinho',
      neighborhood: 'Centro',
      street: 'Rua Principal, 100',
    })

    expect(response.statusCode).toEqual(201)
  })
})