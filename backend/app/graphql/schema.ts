import { buildSchema } from 'type-graphql'
import { authChecker } from './authChecker'
import { ParkingSpotsResolver } from './resolvers/ParkingSpotsResolver'
import { UserResolver } from './resolvers/UserResolver'
import { ReservationRequestResolver } from './resolvers/ReservationRequestResolver'
import { SettingsResolver } from './resolvers/SettingsResolver'
import { RankingResolver } from './resolvers/RankingResolver'
import { HistoryResolver } from './resolvers/HistoryResolver'
import { StatisticsResolver } from './resolvers/StatisticsResolver'

const resolvers = [
  SettingsResolver,
  ParkingSpotsResolver,
  UserResolver,
  ReservationRequestResolver,
  RankingResolver,
  HistoryResolver,
  StatisticsResolver,
]

export const schema = buildSchema({ resolvers, authChecker })
