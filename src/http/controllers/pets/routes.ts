import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { details } from './details'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', search)
  app.get('/pets/:id', details)


  app.post('/pets', { onRequest: [verifyJwt] }, create)
}