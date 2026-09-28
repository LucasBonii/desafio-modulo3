import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchPetsUseCase } from '@/use-cases/factories/make-fetch-pet-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'SENIOR']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    independence_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  })

  const { city, age, size, energy_level, independence_level } =
    searchPetsQuerySchema.parse(request.query)

  const fetchPetsUseCase = makeFetchPetsUseCase()

  const { pets } = await fetchPetsUseCase.execute({
    city,
    age,
    size,
    energy_level,
    independence_level,
  })

  return reply.status(200).send({ pets })
}