FROM node:14-alpine
# Adding build tools to make yarn install work on Apple silicon / arm64 machines
# RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY . .
RUN cd /app &&  npm i
RUN cd /app/my-desgin-dome && npm i
# RUN cd /app/my-desgin-dome && npm run dev
CMD ["cd", "/app/my-desgin-dome", '&&','npm','run dev']