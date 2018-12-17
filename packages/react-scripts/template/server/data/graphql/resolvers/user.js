import { User } from '../../models';

export default {
  Query: {
    async allUsers() {
      return await User.findAll();
    },

    async fetchUser(_, { id }) {
      return await User.findById(id);
    },
  },

  Mutation: {
    async login(_, { email }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('Login failed.');
      }

      // TODO(mime)
    },

    async createUser(_, { username, email }) {
      return await User.create({ username, email });
    },
  },
};
