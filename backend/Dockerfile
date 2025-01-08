# Basis-Image
FROM node:18-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# Port und Startbefehl
EXPOSE 5000
CMD ["npm", "start"]
