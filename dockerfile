FROM node:20

WORKDIR /src
RUN ls
COPY package.json .
RUN npm install 

COPY . .
EXPOSE 3000

CMD ["node", "app.js"]