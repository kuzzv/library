FROM node

COPY . /app

ENV NODE_ENV development

ENV PORT "4000"
ENV JWT_SECRET "secret"
ENV PG_CONNECTION_STRING "postgres://library:library@db:5432/library"
ENV ADMIN_LOGIN "admin"
ENV ADMIN_PASSWORD "password"
ENV CORS_ORIGIN "*"
ENV VUE_APP_GRAPHQL_HOST "http://localhost:4000/graphql"
ENV VUE_APP_STATIC "http://localhost:4000/"

WORKDIR /app/frontend
RUN npm install && npm run build

WORKDIR /app/backend
RUN npm install

CMD npm run start

EXPOSE 4000