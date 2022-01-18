FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# bundle app source
COPY . .

RUN yarn install
RUN yarn build

EXPOSE 80
CMD ["yarn", "start"]
