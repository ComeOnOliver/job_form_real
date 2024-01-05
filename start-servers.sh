#!/bin/bash

# Update package lists
echo "Updating package lists..."
apt-get update

# Install screen if it is not already installed
if ! command -v screen &> /dev/null; then
    echo "Screen is not installed. Installing screen..."
    apt-get install -y screen
fi

# Navigate to the backend directory and run yarn install
cd app
yarn install

# Start the backend server in a new screen session
echo "Starting the backend server in a screen session..."
screen -dmS backend-server yarn start

# Navigate to the frontend directory and run yarn install
cd ../frontend
yarn install

# Start the frontend server in a new screen session
echo "Starting the frontend server in a screen session..."
screen -dmS frontend-server yarn start

# List running screen sessions
screen -list
