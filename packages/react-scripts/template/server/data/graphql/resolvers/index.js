import userResolvers from './user';

const exampleResolvers = {
  Query: {
    // Just spits out what it's given as a test example.
    async echoExample(parent, { str }, { currentUser, models }) {
      return { exampleField: str };
    },

    hello: () => 'GraphQL',
  },
};

export default [exampleResolvers, userResolvers];
