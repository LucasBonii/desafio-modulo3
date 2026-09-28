import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate'

describe('Get Pet Details (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet details with org information', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const createPetResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Thor',
        about: 'Cão de guarda',
        age: 'ADULT',
        size: 'LARGE',
        energy_level: 'HIGH',
        independence_level: 'LOW',
        environment: 'Grande',
      })

    const petId = createPetResponse.body.pet.id

    const response = await request(app.server).get(`/pets/${petId}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: 'Thor',
      }),
    )
    expect(response.body.org).toEqual(
      expect.objectContaining({
        whatsapp: '46999999999',
      }),
    )
  })
})