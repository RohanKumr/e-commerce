const app = require("./app");
const dotenv = require("dotenv");

//uncaught exception
process.on("uncaughtException", (err) => {
  console.log("server shut down uncaught exception");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

//config
dotenv.config({ path: "backend/config/config.env" });

const connectDb = require("./config/databse");
connectDb();

const server = app.listen(process.env.PORT, () => {
  console.log("localhost", process.env.PORT);
});

//Unhandled promises error
process.on("unhandledRejection", (err) => {
  console.log("server shut down unhandled rejection");
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
