FROM node:16
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
RUN npm run build

FROM nginx
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/templates/default.conf.template