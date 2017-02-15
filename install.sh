# -- BUILD AND INSTALL AUTHENTICATION --

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
sudo apt-get install -y nodejs

# Install 'typescript' node package
npm install -g typescript

# Install 'gulp' node package
npm install -g gulp

# Install 'angular-cli' node package
npm install -g @angular/cli

# Clone 'Authentication' repository
git clone https://github.com/developersworkspace/Authentication.git

# Change directory to 'api'
cd ./Authentication/api

# Install node packages for 'api'
npm install

# Build 'api'
npm run build

# Change directory to 'web'
cd ./../web

# Install node packages for 'web'
npm install

# Build 'web'
npm run build

# Change directory to 'admin'
cd ./../web

# Install node packages for 'admin'
npm install

# Build 'admin'
npm run build

# Change to root of repository
cd ./../

# Build and run docker compose as deamon
docker-compose up -d

