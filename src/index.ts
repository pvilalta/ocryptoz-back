if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
import accountRouter from './app/routers/accountRouter';
import walletRouter from './app/routers/walletRouter';
import eventRouter from './app/routers/eventRouter';
import contentRouter from './app/routers/contentRouter';



const app = express();


// declare module 'express' {
//   interface Request {
//       user: number;
//   }
//}

app.use(cors({origin: 'http://localhost:8080', credentials: true}))
app.use(express.json());
app.use(cookieParser());



const port = process.env.PORT || 3000;

app.use(accountRouter, walletRouter, eventRouter, contentRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
