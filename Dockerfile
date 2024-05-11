# Use the official Node.js 20 image as a parent image
FROM node:20-slim
LABEL org.opencontainers.image.authors="Michael Milawski <mmilawski@gmail.com>"

# Set the working directory
WORKDIR /usr/src/app

# Install xvfb and other necessary libraries for Chrome
RUN apt-get update && apt-get install -y wget xvfb gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV GROVER_NO_SANDBOX="true"
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"
ENV DISPLAY=":99"

RUN yarn install && yarn build
RUN chown -R node:node /usr/src/app

# Expose the port your app runs on
EXPOSE 3000
USER node

# Command to start your application
#CMD xvfb-run :99 --server-args="-screen 0 1024x768x24" yarn start
#CMD yarn start
# exec: Xvfb :99 -screen 0 1280x720x16 & yarn start
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x720x16 & yarn start"]
