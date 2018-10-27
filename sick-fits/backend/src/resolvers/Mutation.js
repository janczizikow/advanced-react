const Mutations = {
  async createUser(parent, args, ctx, info) {
    const users = await ctx.db.mutation.createUser({
      data: {
        ...args
      }
    }, info);
    return users;
  },

  async createItem(parent, args, ctx, info) {
    // TODO: Check if authenticated
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  }
};

module.exports = Mutations;
