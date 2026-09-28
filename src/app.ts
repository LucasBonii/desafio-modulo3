import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError, z } from 'zod'
import { env } from '@/env'
import { orgsRoutes } from './http/controllers/orgs/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(orgsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.',  issues: z.treeifyError(error)})
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})