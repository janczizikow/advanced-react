const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");
const stripe = require("../stripe");

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

  async requestReset(parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if (!user) {
      throw new Error(`No user found for email ${args.email}`);
    }

    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    const mailResponse = await transport.sendMail({
      from: "info@sickfits.com",
      to: user.email,
      subject: "Password reset instructions",
      html: makeANiceEmail(`Please open the following link to reset your password:
      \n\n
      <a href="${
        process.env.FRONTEND_URL
      }/reset-password?resetToken=${resetToken}">
        Click here to rest your password
      </a>`)
    });

    return { message: "Reset instructions sent via email" };
  },
  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;

    // Check if the passwords match
    if (password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }

    // Check if the token is valid and not expired
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 3600000 }
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    // Update the password and remove the resetToken
    const newPassword = await bcrypt.hash(password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        passwordDigest: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // Set the cookie with JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );

    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    return ctx.db.mutation.updateUser(
      {
        data: {
          permission: {
            set: args.permission
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to add an item");
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
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
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }

    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item(
      { where },
      `{ id, title, user { id } }`
    );
    // 2. Check if record.user === user || user is admin
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permission.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    if (!ownsItem || !hasPermission) {
      throw new Error("You don't have permission to do that!");
    }

    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + 1
          }
        },
        info
      );
    } else {
      return ctx.db.mutation.createCartItem(
        {
          data: {
            user: {
              connect: { id: userId }
            },
            item: {
              connect: { id: args.id }
            }
          }
        },
        info
      );
    }
  },
  async removeFromCart(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    const [cartItem] = await ctx.db.query.cartItems(
      {
        where: {
          id: args.id,
          user: { id: userId }
        }
      },
      `{ id, user { id } }`
    );

    if (!cartItem || cartItem.user.id !== userId) {
      throw new Error("Item not found in your cart");
    }

    return ctx.db.mutation.deleteCartItem(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async createOrder(parent, args, ctx, info) {
    // 1. Query the current user and make sure they are signed in
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in!");
    }

    const user = await ctx.db.query.user(
      { where: { id: userId } },
      `{
        id
        name
        email
        cart {
          id
          quantity
          item {
            id
            title
            description
            price
            image
            largeImage
          }
        }
      }`
    );
    // 2. Recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
      0
    );
    // 3. Create the stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token
    });
    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        user: { connect: { id: userId } },
        quantity: cartItem.quantity,
        ...cartItem.item
      };
      delete orderItem.id;
      return orderItem;
    });
    // 5. Create the Order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } }
      }
    });
    // 6. Clean up - clear the users cart, delete CartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: { id: cartItemIds }
    });
    // 7. Return the Order to the client
    console.log(order);
    return order;
  }
};

module.exports = Mutations;
