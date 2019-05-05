FROM ubuntu:16.04

RUN apt-get update -y \
  && apt-get install -y curl sudo openssl \
  && curl -s https://fibos.io/download/installer.sh?v1_5_4_1 | sh

CMD ["fibos", "/fibos/start.js"]

EXPOSE 9870 8870
