FROM ubuntu:16.04

WORKDIR /api
COPY ./ ./

RUN apt-get update -y \
  && apt-get install make g++ -y \
  && apt-get install -y curl \
  && apt-get install -y sudo \
  && apt-get install -y openssl \
  && curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh \
  && bash nodesource_setup.sh \
  && apt-get install nodejs -y \
  && npm install pm2 -g \
  && npm install 

CMD ["pm2-runtime", "node index.js"]

EXPOSE 10401
