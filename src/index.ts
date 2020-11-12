if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
import accountRouter from './app/routers/accountRouter';
import walletRouter from './app/routers/walletRouter';
import eventRouter from './app/routers/eventRouter';




const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.use(accountRouter, walletRouter, eventRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
