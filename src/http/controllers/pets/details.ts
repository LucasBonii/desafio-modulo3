import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getPetDetailsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getPetDetailsParamsSchema.parse(request.params)

  try {
    const getPetDetailsUseCase = makeGetPetDetailsUseCase()

    const { pet, org } = await getPetDetailsUseCase.execute({
      id,
    })

    return reply.status(200).send({
      pet,
      org: {
        id: org.id,
        name: org.name,
        whatsapp: org.whatsapp,
        city: org.city,
        state: org.state,
      },
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}