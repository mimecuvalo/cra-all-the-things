import authorization from '../../../authorization';
import { ForbiddenError } from 'apollo-server-express';
import { skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { currentUser }) =>
  authorization.isAuthenticated(currentUser) ? skip : new ForbiddenError('Not logged in.');

export const isAdmin = (parent, args, { currentUser }) =>
  authorization.isAdmin(currentUser) ? skip : new ForbiddenError('I call shenanigans.');
