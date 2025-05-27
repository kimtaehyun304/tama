# 실행 전용 이미지
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production


#수정
EXPOSE 3000
CMD ["npm", "start"]
