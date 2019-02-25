require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const cors = require('@koa/cors');
const jwt = require("koa-jwt");
const { ApolloServer } = require("apollo-server-koa");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const app = new Koa();

// cors
app.use(cors({ origin: process.env.CORS_ORIGIN }));

// healthcheck endpoint
const router = new Router();
router.get("/_health", ctx => {
  ctx.body = "OK";
});
app.use(router.routes());
app.use(router.allowedMethods());

// jwt
app.use(jwt({ secret: process.env.JWT_SECRET, passthrough: true }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({
    ctx: {
      state: { user }
    }
  }) => {
    return { user };
  }
});
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${
      server.graphqlPath
    }`
  )
);
