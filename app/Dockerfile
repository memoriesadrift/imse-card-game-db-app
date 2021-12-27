FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# uncomment for production
# RUN yarn build

# bundle app source
COPY . .

EXPOSE 80
CMD ["yarn", "dev"]
