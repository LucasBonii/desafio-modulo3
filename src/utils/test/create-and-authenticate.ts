import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
    name: 'Amigos dos Animais',
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

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'contato@amigos.com',
    password: 'password123',
  })

  const { token } = authResponse.body

  return { token }
}