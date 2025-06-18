FROM node:18-alpine

WORKDIR /app

#ENV NODE_ENV=production

COPY ./ ./          
RUN [ -f Dockerfile ] && rm Dockerfile || true

EXPOSE 3000

CMD ["node", "server.js"]
