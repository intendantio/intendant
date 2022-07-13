FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./template/package.json /usr/src/app/
COPY ./template/intendant.db /usr/src/app/
RUN npm install
COPY . /usr/src/app
CMD [ "node", "./node_modules/@intendant/core/index" ]
EXPOSE 8000