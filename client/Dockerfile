FROM node:18.18.2
WORKDIR /Hotel_AdminDashboard/client
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm start" ]
