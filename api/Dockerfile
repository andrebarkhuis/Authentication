FROM node:6.9.4

RUN npm install -g gulp
ADD . ./api
ADD ./../core ./core
RUN npm install
# RUN gulp ts

EXPOSE 9009

CMD ["node", "app.js"]