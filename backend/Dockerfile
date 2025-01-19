FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g ngrok

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node server.js & ngrok http 5000 --authtoken=2rqC7ZFqdCsNBgzKSRAaFuBIiH4_3jUrv1hwZJzzyb8g8MWWX --region=eu --url=lucky-forcibly-stingray.ngrok-free.app" ]
