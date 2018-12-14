import { User } from '../models';

const resolvers = {
  Query: {
    hello: () => 'GraphQL',

    async allUsers() {
      return await User.findAll();
    },

    async fetchUser(_, { id }) {
      return await User.findById(id);
    },
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Login failed.');
      }

      // TODO(mime)
    },

    async createUser(_, { name, email }) {
      return await User.create({ name, email });
    },
  },
};

export default resolvers;
