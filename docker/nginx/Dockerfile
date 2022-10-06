FROM mhart/alpine-node:12.18.3 as build-stage

RUN apk add --update --no-cache nano openssl curl
RUN curl -o- -L https://yarnpkg.com/install.sh | sh
RUN mkdir /app
COPY ./ /app
WORKDIR /app
RUN yarn install --no-cache --frozen-lockfile
RUN yarn build

FROM nginx:1.15.9-alpine

ADD docker/nginx/nginx.conf /etc/nginx/nginx.conf
ADD docker/nginx/domain.conf /etc/nginx/sites-available/domain.conf

RUN mkdir /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/domain.conf /etc/nginx/sites-enabled/domain
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/build/ /var/www/
WORKDIR /var/www/

CMD ["nginx"]
