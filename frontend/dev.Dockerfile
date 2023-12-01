FROM node:20

COPY package*.json ./

RUN npm install -g firebase-tools

RUN npm install

WORKDIR /workspace/frontend

COPY . .

# Command to run the app
CMD ["npm", "run", "dev"]