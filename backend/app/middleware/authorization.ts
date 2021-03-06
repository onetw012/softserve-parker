import { Response, Request, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'
import { Session } from '../domain/Session'

function getTokenFromRequest (req: Request): string {
  const authHeader: string = req.header('Authorization')
  if (!authHeader) throw new UnauthenticatedError('Token not provided')
  return authHeader.split(' ')[1]
}

function assertUserIsAuthorized (userToken: string, sessionToken: string): void | Error {
  const cert: string = fs.readFileSync(path.resolve(__dirname, '../../public.key'), 'utf8')
  if (!sessionToken || !jwt.verify(userToken, cert)) {
    throw new UnauthenticatedError('Unauthorized')
  }
}

export async function isAuthorized (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    // this is a quick fix to allow unauthorized access to graphql web client
    return next()
  }

  if (req.method === 'POST' && req.body.query === 'query { today, deadline, cancelHour }') {
    // allowing for date query to not be authorized
    return next()
  }

  try {
    const userToken: string = getTokenFromRequest(req)
    const token: string = await Session.fetchToken(userToken)
    assertUserIsAuthorized(userToken, token)
    next()
  } catch (e) {
    logger.error(e)
    res.status(e.status || 500).send(e.message)
  }
}
