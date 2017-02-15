# -- BUILD AND INSTALL AUTHENTICATION --

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
sudo apt-get install -y nodejs

# Install 'typescript' node package
sudo npm install -g typescript

# Install 'gulp' node package
sudo npm install -g gulp

# Install 'angular-cli' node package
sudo npm install -g @angular/cli

# Clone 'Authentication' repository
sudo git clone https://github.com/developersworkspace/Authentication.git

# Change directory to 'api'
sudo  cd ./Authentication/api

# Install node packages for 'api'
sudo npm install

# Build 'api'
sudo npm run build

# Change directory to 'web'
sudo cd ./../web

# Install node packages for 'web'
sudo npm install

# Build 'web'
sudo npm run build

# Change directory to 'admin'
sudo cd ./../admin

# Install node packages for 'admin'
sudo npm install

# Build 'admin'
sudo npm run build

# Change to root of repository
sudo cd ./../

# Build and run docker compose as deamon
sudo docker-compose up -d

