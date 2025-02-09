# Usamos una imagen oficial de Node.js
FROM node:16-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos el package.json y package-lock.json para instalar las dependencias
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos del proyecto
COPY . .

# Ejecutamos `npm run build` para generar los archivos estáticos
RUN npm run build

# Exponemos el puerto donde el frontend se ejecutará
EXPOSE 80

# Por último, configuramos Nginx para servir los archivos estáticos
CMD ["npm", "start"]