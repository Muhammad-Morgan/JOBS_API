require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const cors = require("cors")
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect")
const authMiddleware = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use(cors()); // Enables CORS for all routes
// extra packages
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,//15 mins
  max: 100
}))

app.use(helmet());
app.use(xss());
// routes
app.use('/api/v1/jobs', authMiddleware, require("./routes/jobs"));
app.use("/api/v1/auth", require("./routes/auth")
)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
