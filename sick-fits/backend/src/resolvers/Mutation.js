const Mutations = {
  async createUser(parent, args, context, info) {
    const users = await contex.db.mutation.createUser({
      data: {
        ...args
      }
    }, info);
    return users;
  },

  async createItem(parent, args, context, info) {
    // TODO: Check if authenticated
    const item = await context.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  }
};

module.exports = Mutations;
