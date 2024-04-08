import { config } from 'dotenv'
config()

import * as express from 'express';
import * as bodyParser from "body-parser";

import * as mongoose from 'mongoose';
import * as cors from 'cors'

import { Routes } from './routes/index';
class App {
    public app: express.Application;
    public route: Routes = new Routes();
    public mongoUrl: string = process.env.MONGO_URL;
    
  constructor() {
    this.app = express();
    this.config();
    this.route.routes(this.app);
    this.app.set('trust proxy', 1)
    this.mongoSetup();
        
    }

    private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({  limit: '50mb', extended: false}));
    this.app.use(cors());

    }


private mongoSetup(): void {
  // mongoose.Promise = global.Promise;
  // mongoose.connect(this.mongoUrl, { useNewUrlParser: true });

  mongoose.connect(this.mongoUrl)
  .then(res => { console.log(`${this.mongoUrl}`) })
  .catch(err => { console.log('mongo error in connection:', err) });

}
}
export default new App().app;
