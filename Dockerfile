FROM node:14.16.0-alpine3.13

# It installs the nodemon package globally for monitoring and watching the backend Express server
# RUN npm install -g nodemon

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

EXPOSE 4000

CMD ["npm", "start"]