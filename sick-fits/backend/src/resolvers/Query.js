const { forwardTo } = require('prisma-binding');

const Query = {
  async users(parent, args, ctx, info) {
    const users = await ctx.db.query.users();
    return users;
  },
  items: forwardTo('db'),
  item: forwardTo('db'),
};

module.exports = Query;
