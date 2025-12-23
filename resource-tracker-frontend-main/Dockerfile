FROM node:20.11.1
EXPOSE 3002
COPY . ./resource-tracker-app
WORKDIR /resource-tracker-app
RUN npm install sass@1.42.1 --legacy-peer-deps
RUN npm install --legacy-peer-deps
RUN ls -l /resource-tracker-app/src
RUN npm run build 
ENTRYPOINT ["node","server.js"]