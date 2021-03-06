import { Arg, Int, Query, Resolver, Mutation, ID } from 'type-graphql'
import { User } from '../../domain/User'

@Resolver(User)
export class UserResolver {
  @Query(() => Boolean!)
  async isLoggedIn () {
    // authentication will return an error if not logged in
    return true
  }

  @Query(() => [User], {
    description: 'Returns all users',
  })
  async allUsers () {
    return User.all()
  }

  @Query(() => User!, {
    description: 'Returns a given user',
  })
  async user (
    @Arg('email', () => String!)
    email: string,
  ) {
    return User.byEmail(email)
  }

  @Mutation(() => ID, {
    description: 'Returns newly created user id',
  })
  async createUser (
    @Arg('email', () => String!)
    email: string,
    @Arg('password', () => String!)
    password: string,
    @Arg('firstName', () => String!)
    firstName: string,
    @Arg('lastName', () => String!)
    lastName: string, 
    @Arg('plate', () => String!)
    plate: string,
    @Arg('phone', () => String!)
    phone: string,
    @Arg('roles', () => String!)
    roles: string,
    @Arg('state', () => String!)
    state: string,
    @Arg('description', () => String, { nullable: true })
    description: string,
  ) {
    const newUserId = await User.create(email, password, firstName, lastName, plate, phone, roles, state, description)
    if (description) {
      await User.updateDescription(newUserId, description)
    }

    return newUserId
  }

  @Mutation(() => Int, {
    description: 'Update user',
  })
  async updateUser (
    @Arg('state', () => String!)
    state: string,
    @Arg('firstName', () => String!)
    firstName: string,
    @Arg('lastName', () => String!)
    lastName: string, 
    @Arg('plate', () => String!)
    plate: string,
    @Arg('id', () => ID!)
    id: number,
    @Arg('phone', () => String!)
    phone: string,
    @Arg('roles', () => String!)
    roles: string,
    @Arg('description', () => String, { nullable: true })
    description: string,
  ) {
    return User.update(id, state, firstName, lastName, plate, phone, roles, description)
  }

  @Mutation(() => Int, {
    description: 'Remove user',
  })
  async removeUser (
    @Arg('id', () => ID!)
    id: number,
  ) {
    return User.delete(id)
  }

  @Mutation(() => String!, {
    description: 'Send confirmation email, returns email',
  })
  async sendConfirmationEmail (
    @Arg('id', () => ID!)
    id
  ) {
    const user = await User.byId(id)
    if (user.state === 'inactive') {
      await User.sendConfirmationEmail(user.email, id)
      return user.email
    } else if (user.state === 'active') {
      throw new Error(`User with id ${id} already activated`)
    } else if (user && user.state === 'deleted') {
      throw new Error(`User with id ${id} is deleted`)
    }
  }
}
