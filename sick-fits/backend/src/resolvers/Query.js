const { forwardTo } = require('prisma-binding');

const Query = {
  async users(parent, args, context, info) {
    const users = await context.db.query.users();
    return users;
  },
  items: forwardTo('db'),
};

module.exports = Query;
