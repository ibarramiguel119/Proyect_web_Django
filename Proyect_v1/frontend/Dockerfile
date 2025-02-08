# Usar una imagen base de Node.js para construir la app
FROM node:18 AS build

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias de la app
RUN npm install

# Copiar el código fuente de la app al contenedor
COPY . .

# Construir la aplicación React
RUN npm run build

# Usar una imagen base de Nginx para servir la app construida
FROM nginx:alpine

# Copiar los archivos construidos al directorio de Nginx para que los sirva
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80 para acceder a la app
EXPOSE 80

# Iniciar Nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]