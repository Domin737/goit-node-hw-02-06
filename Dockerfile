# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create a directory for avatars
RUN mkdir -p public/avatars

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV production

# Run the application
CMD ["npm", "start"]