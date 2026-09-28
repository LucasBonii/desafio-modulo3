import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Search Pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets by city and filters', async () => {
    const org = await prisma.org.create({
      data: {
        name: 'ONG Busca',
        author_name: 'John',
        email: 'busca@org.com',
        whatsapp: '46999999999',
        password_hash: '123456',
        cep: '85555000',
        state: 'PR',
        city: 'Pato Branco',
        neighborhood: 'Centro',
        street: 'Rua Teste',
      },
    })

    await prisma.pet.create({
      data: {
        name: 'Rex',
        about: 'Cão brincalhão',
        age: 'PUPPY',
        size: 'MEDIUM',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'Espaçoso',
        org_id: org.id,
      },
    })

    const response = await request(app.server).get('/pets').query({
      city: 'Pato Branco',
      age: 'PUPPY',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: 'Rex',
      }),
    )
  })
})