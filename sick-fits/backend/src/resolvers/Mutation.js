const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  async createUser(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const passwordDigest = await bcrypt.hash(args.password, 10);
    delete args.password;
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          passwordDigest,
          permission: { set: "USER" }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    console.log(email, password);
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const validCredentials = await bcrypt.compare(
      password,
      user.passwordDigest
    );

    if (!validCredentials) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    return user;
  },

  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "You've signned out succsefully" };
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
        }
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
