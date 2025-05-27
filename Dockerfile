# 실행 전용 이미지
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY .next ./.next
COPY public ./public
COPY node_modules ./node_modules
COPY package.json ./

#수정
EXPOSE 3000
CMD ["npm", "start"]
