import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(['PUPPY', 'ADULT', 'SENIOR']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energy_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    independence_level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.string(),
  })

  const {
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
  } = createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  const { pet } = await createPetUseCase.execute({
    name,
    about,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    org_id: request.user.sub,
  })

  return reply.status(201).send({ pet })
}