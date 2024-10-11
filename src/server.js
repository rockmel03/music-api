import app from "./app.js";
import { connectDB } from "./DB/index.js";

const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });
    app.listen(port, () => {
      console.log(`app listening on port ${port}!`);
    });
  })
  .catch((error) => {
    console.error("mongoDB connection error", error);
  });
