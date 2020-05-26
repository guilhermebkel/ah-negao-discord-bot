FROM node:current-stretch
RUN mkdir -p /gallery/api
WORKDIR /gallery/api
COPY ./package.json /gallery/api
COPY ./package-lock.json /gallery/api
ENV NODE_ENV production
RUN npm ci
COPY . /gallery/api
RUN npm run build
ENV PORT 80
EXPOSE 80 3667
CMD [ "npm", "run", "start" ]