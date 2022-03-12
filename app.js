const express = require("express");
const morgen = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");
const connectDb = require("./Helpers/mongodb");
const { infoLogger, errorLogger } = require("./Utils/logger");
const AuthRoute = require("./Routes/AuthRoute");
const { verifyAccessToken } = require("./Helpers/jwt_helper");
const client = require("./Helpers/redis");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerJson = require("./Helpers/swagger.json");

dotenv.config();
const app = express();

const options = {
  definition: {
    openapi: "V1.0.0",
    info: {
      title: "Bimaxpress",
      description: "Bimaxpress decs",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  apis: ["./Routes/*.js"],
};

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(null, options));

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson, options));

app.use(morgen("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.get("/", verifyAccessToken, async (req, res, next) => {
  // console.log(req.headers['authorization'])
  res.send("Welcome to node_mongodb_auth project");
});

app.post("/arjunpatidar", async (req, res, next) => {
  // console.log(req.headers['authorization'])
  res.send(req.body);
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exist"));
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  infoLogger.info(`server running on port ${PORT}`);
});
