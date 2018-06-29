**DMM UI**

User Interface for Digital Marketing Master.

## Based upon

- [Create React App](https://github.com/facebookincubator/create-react-app).
- [Ant Design](https://ant.design/components).

## Development

- Install recent NodeJS

```
git clone <this repo>
npm install

brew install mongodb
sudo mkdir /data
sudo mkdir /data/db
sudo chmod +x+r+w /data/db/
sudo touch /data/db/mongodb.lock
sudo chown $USER /data/db
brew tap homebrew/services
brew services start mongodb

Download the cadc mongo db dump file from - https://bamboo.sony.eu/browse/GWTDUMP-DUMP/latest
tar -xzf dump.tar.xz
mongorestore dump

navigate to `/server` directory & run these commands `npm install` && `node server`

then go to root directory and run
npm start
```
