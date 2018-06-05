FROM node:carbon-alpine

# For building native dependencies
RUN apk add --no-cache make gcc g++ python
# For building sharp
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/

# App root
# /app
#    |- node_modules (dependencies)
#    |- src (app sources)
#
WORKDIR /app

# Needed to install dependencies
COPY package.json /app

# Set dependencies path
ENV PATH /app/node_modules/.bin:$PATH

# Dependencies
RUN yarn install
# Global Dependencies
RUN yarn global add nodemon ts-node typescript

# Create seperate folder for code source
RUN mkdir /app/src
WORKDIR /app/src