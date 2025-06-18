
FROM node:18-alpine

WORKDIR /app          

EXPOSE 3000

CMD ["node", "server.js"]
