FROM node:20

WORKDIR /src
RUN ls
COPY package.json .
RUN npm install 

COPY . .

CMD ["node", "app.js"]