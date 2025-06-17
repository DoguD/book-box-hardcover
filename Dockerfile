FROM node:lts-alpine

# Labels for GitHub to read your action
LABEL "com.github.actions.name"="book-box-hardcover"
LABEL "com.github.actions.description"="Update a pinned gist to contain your latest reads on Hardcover.app"

# Cheatsheet for GitHub action branding: https://haya14busa.github.io/github-action-brandings/
LABEL "com.github.actions.icon"="book-open"
LABEL "com.github.actions.color"="green"

# Copy the package.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your action's code
COPY . .

# Run `node index.js`
ENTRYPOINT ["node", "index.js"]
