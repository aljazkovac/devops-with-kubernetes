FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
# Install only production dependencies to keep image size small
RUN npm install --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]