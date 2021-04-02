import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import authorization from '../../../authorization';
import { skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { currentUser }) =>
  authorization.isAuthenticated(currentUser) ? skip : new AuthenticationError('Not logged in.');

export const isAdmin = (parent, args, { currentUser }) =>
authorization.isAuthenticated(currentUser)
    ? (authorization.isAdmin(currentUser) ? skip : new ForbiddenError('I call shenanigans.'))
    : new AuthenticationError('Not logged in.');
