# Use a smaller base image
FROM node:14-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
RUN npm config set unsafe-perm true
RUN npm install --parallel

# Copy source code
COPY . .

# Use a smaller base image for the final image
FROM node:14-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only the built files from the previous stage
COPY --from=build /usr/src/app ./
COPY --from=build /usr/src/app/package.json ./

# Expose port
EXPOSE 5200

# Run script to create users on start up
CMD ["sh", "-c", "npm run create-users && npm run local"]

# # # Clean up database details on shut down
# STOPSIGNAL SIGINT
# ENTRYPOINT ["sh", "-c", "npm run delete-users"]