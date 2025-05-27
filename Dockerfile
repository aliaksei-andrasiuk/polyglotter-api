FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production

COPY . .

RUN npx prisma generate

EXPOSE 3000
CMD ["yarn", "start"]
