const Mutations = {
  async createUser(parent, args, ctx, info) {
    const users = await ctx.db.mutation.createUser(
      {
        data: {
          ...args
        }
      },
      info
    );
    return users;
  },

  async createItem(parent, args, ctx, info) {
    // TODO: Check if authenticated
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    console.log(args);
    delete updates.id; // Don't overwrite the id

    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        },
      },
      info
    );
    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id, title }`);
    // TODO: 2. Check if record.user === user || user is admin

    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
