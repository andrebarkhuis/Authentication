# Build from node:6.9.4 Images
FROM node:6.9.4

# Copy 'api' source to docker container
ADD ./api /api
WORKDIR /api
RUN npm install

# Copy 'core' source to docker container
ADD ./core /core
WORKDIR /core
RUN npm install

# Change working directory to root path
WORKDIR /

# Start api using node cli
CMD ["node", "./api/app.js"]