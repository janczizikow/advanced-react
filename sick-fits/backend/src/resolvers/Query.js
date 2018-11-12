const { forwardTo } = require("prisma-binding");

const Query = {
  async users(parent, args, ctx, info) {
    const users = await ctx.db.query.users();
    return users;
  },
  async me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }
    const user = await ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
    return user;
  },
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db")
};

module.exports = Query;
