FROM node:6.9.4

ADD ./api /api
WORKDIR /api
RUN npm install

ADD ./core /core
WORKDIR /core
RUN npm install

WORKDIR /

CMD ["node", "./api/app.js"]