require("dotenv").config();
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const AUTH_ERROR_MESSAGE = "Auth error";

const authUser = async (login, password) => {
  try {
    const user = await knex("clients")
      .where({
        name: login
      })
      .first();
    if (!user) {
      throw new Error(AUTH_ERROR_MESSAGE);
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return jwt.sign({ name: user.name, id: user.id }, process.env.JWT_SECRET);
    }
    throw new Error(AUTH_ERROR_MESSAGE);
  } catch (e) {
    throw e;
  }
};

// temporary simple implementation
const authAdmin = (login, password) => {
  if (
    login == process.env.ADMIN_LOGIN &&
    password == process.env.ADMIN_PASSWORD
  ) {
    return jwt.sign(
      { admin: true, name: process.env.ADMIN_LOGIN },
      process.env.JWT_SECRET
    );
  } else {
    throw new Error(AUTH_ERROR_MESSAGE);
  }
};

const registerUser = async (name, password) => {
  try {
    await knex("clients").insert({
      name,
      password: await bcrypt.hash(password, saltRounds)
    });
  } catch (error) {
    throw new Error(AUTH_ERROR_MESSAGE);
  }
  return authUser(name, password);
};

module.exports = {
  authUser,
  authAdmin,
  registerUser
};
