FROM node:14-alpine as build

# 设置环境变量
ENV NODE_ENV production

WORKDIR /app

USER root

# 先一步安装依赖， 为了 using cache
# https://docs.docker.com/get-started/09_image_best/#layer-caching
COPY package*.json yarn.lock ./

# 安装依赖。 production false 防止依赖位置不正确，导致缺少编译依赖项。
RUN yarn install --silent --production=false --registry=https://registry.npm.taobao.org

# 拷贝需要编译的代码
COPY ./src ./src
COPY ./config ./config
COPY ./public ./public

# 打包构建
RUN yarn build:preview

###########
# nginx
###########
FROM nginx:alpine

# # 拷贝配置文件到nginx
COPY /.docker/nginx.conf /etc/nginx/conf.d/default.conf

# 从build中（上面那个 FROM）拷贝出编译结果
COPY --from=build /app/dist /usr/share/nginx/html/store

# # 启动nginx，关闭守护式运行，否则容器启动后会立刻关闭
CMD ["nginx", "-g", "daemon off;"]
