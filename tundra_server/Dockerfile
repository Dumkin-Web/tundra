FROM node:12-alpine
WORKDIR /app
COPY . .
COPY package.json /app/package.json
RUN npm install
EXPOSE 5000 
USER node
CMD npm start