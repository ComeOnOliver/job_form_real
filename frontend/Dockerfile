# frontend/Dockerfile
FROM node:14

# Create app directory
WORKDIR /usr/src/frontend

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .

# Expose the port the frontend runs on
EXPOSE 3000

# Command to run the app
CMD ["yarn", "start"]
