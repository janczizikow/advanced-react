const Query = {
  users(parent, args, context, info) {
    global.users = global.users || [];
    return global.users;
  },
};

module.exports = Query;
