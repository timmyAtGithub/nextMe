FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g ngrok

COPY . .

COPY .env .env

COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 5000

CMD ["/start.sh"]
