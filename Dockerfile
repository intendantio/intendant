FROM node:16
WORKDIR /usr/src/app
ADD "https://raw.githubusercontent.com/intendantio/intendant/main/template/package.json" package.json
ADD "https://raw.githubusercontent.com/intendantio/intendant/main/template/intendant.db" intendant.db
RUN npm install
EXPOSE 8000
CMD [ "npm", "run-script", "start" ]

