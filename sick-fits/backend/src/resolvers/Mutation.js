const Mutations = {
  createUser(parent, args, context, info) {
    global.users = global.users || [];
    const newUser = { name: args.name };
    global.users.push(newUser);
    return newUser;
  }
};

module.exports = Mutations;
