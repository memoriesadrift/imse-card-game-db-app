FROM nginx:1.21

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY server.cert /etc/nginx
COPY server.key /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
