import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import mongoose from 'mongoose';
import { AddressInfo } from 'net';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import path from 'path';
import crypto from 'crypto';
import CoveyTownsStore from './lib/CoveyTownsStore';
import addTownRoutes from './router/towns';
import FileConnection from './connection';
//import { clearCollections } from './lib/PostTown/DatabaseController';
import { Server } from 'socket.io';
import { CommentTree } from './types/PostTown/comment';


const app = Express();
app.use(CORS());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
const server = http.createServer(app);

const uri = process.env.MONGODB_URI;
let ServerSocket: Server;

if (uri) {
  mongoose.connect(uri).then(() => { console.log('MongoDB Connected'); }).catch(err => console.log(err));

  mongoose.connection.once('open', () => {
    //clearCollections();
    FileConnection.createInstance();
  });

  // create storage engine
  const storage = new GridFsStorage({
    url: uri,
    file: (_req, file) => new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'uploads'
        };
        return resolve(fileInfo);
      });
    }),
  });
  const upload = multer({ storage });

  ServerSocket = addTownRoutes(server, app, upload);
}

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore.getInstance()
      .createTown(process.env.DEMO_TOWN_ID, false);
  }
});

export { ServerSocket }
