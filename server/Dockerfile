FROM node:18-alpine

RUN if ! command -v yarn &> /dev/null; then \
        npm install -g yarn; \
    fi

WORKDIR /server

COPY package.json ./

RUN yarn install

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["yarn", "start:dev"]
