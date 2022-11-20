# base
  FROM alpine:latest AS base

  ENV NODE_ENV=production \
      APP_PATH=/node/app

  WORKDIR $APP_PATH

  RUN apk add --no-cache --update nodejs

# install
  FROM base AS install

  RUN apk add --no-cache --update yarn

  RUN yarn global add @nestjs/cli

  COPY package.json ./

  RUN yarn

  COPY tsconfig.json ./

  COPY tsconfig.build.json ./

  COPY src ./

  RUN yarn build

# build run
  FROM base

  COPY --from=install $APP_PATH/node_modules ./node_modules

  COPY --from=install $APP_PATH/package.json ./package.json

  COPY --from=install $APP_PATH/dist ./dist

  EXPOSE 8080

  CMD ["node", "dist/main"]
