const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
const Query = {
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }

    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    const users = await ctx.db.query.users({}, info);
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
  itemsConnection: forwardTo("db"),
  async order(parent, args, ctx, info) {
    // 1. Make sure user is logged in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in!");
    }
    // 2. Query the current order
    const order = await ctx.db.query.order({ where: { id: args.id } }, info);

    // 3. Check if the user has permissions to see this order
    const ownsOrder = order.user.id === userId;
    const hasPermission = ctx.request.user.permission.includes("ADMIN");

    if (!ownsOrder || !hasPermission) {
      throw new Error("Order not found in your order");
    }
    // 4. Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    // 1. Make sure user is logged in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in!");
    }

    // 2. Query user orders
    const orders = await ctx.db.query.orders(
      {
        where: { user: { id: userId } }
      },
      info
    );

    return orders;
  }
};

module.exports = Query;
