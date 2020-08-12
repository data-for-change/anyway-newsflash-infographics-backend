FROM node:12

#create working directory
WORKDIR /usr/src/anyway-infographic-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

ENV NODE_ENV development

CMD ["node", "./bin/www"]


