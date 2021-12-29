# from https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

FROM node:16

WORKDIR /usr/src/app

# install app dependencies
COPY package.json ./
COPY yarn.lock ./

#RUN npm install -g yarn
RUN yarn install

# bundle app source
COPY . .

EXPOSE 8080
CMD ["yarn", "start"]
