FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV SLACK_BOT_TOKEN your-bot-token
ENV SLACK_SIGNING_SECRET your-signing-secret
ENV PORT 8080

CMD ["npm", "start"]