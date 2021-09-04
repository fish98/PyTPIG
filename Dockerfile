FROM node:12

WORKDIR /usr/src/skondo

COPY package*.json ./

RUN npm config set registry http://registry.npm.taobao.org
RUN npm install 

COPY . .

#EXPOSE 8080
CMD ["node", "ttfish.js"]
