# Use the official Node.js runtime as a parent image
FROM node:24-alpine

# Set the working directory
WORKDIR /app

# Copy package.json (if you have dependencies in the future)
COPY package.json .

# Copy the application code
COPY app.js .

# Run the application
CMD ["node", "app.js"]
