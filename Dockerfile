FROM node:18-alpine

WORKDIR /app

#benastalk 환경에선 자동으로 설정 
ENV NODE_ENV=production

COPY ./ ./          
RUN [ -f Dockerfile ] && rm Dockerfile || true

EXPOSE 3000

CMD ["node", "server.js"]
