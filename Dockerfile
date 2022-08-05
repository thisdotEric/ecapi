# Build the code
FROM node:16-alpine as builder

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . ./
RUN yarn build

# Build the image
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist

RUN yarn install --prod

EXPOSE 3000
CMD node dist/index.js