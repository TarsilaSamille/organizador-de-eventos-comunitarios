brew tap mongodb/brew
brew install mongodb-community

brew services start mongodb-community

mongod
node seed.js

cd backend
node server.js

cd organizador-de-eventos-comunitarios
yarn start
