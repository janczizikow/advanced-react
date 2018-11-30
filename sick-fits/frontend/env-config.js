require("dotenv").config({ path: ".env" });

module.exports = {
  "process.env.STRIPE_PUBLISHABLE_KEY": process.env.STRIPE_PUBLISHABLE_KEY
};
