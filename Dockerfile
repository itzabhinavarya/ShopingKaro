FROM node:18
ENV NODE_ENV=production
COPY . /app
RUN curl -o /app/global-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
WORKDIR /app
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "index.js"]