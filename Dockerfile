FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn build
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/index.js"]
