import express from "express";
import cors from "cors";
import routes from "./routes";
import { errors } from "celebrate";
import * as dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());
app.listen(port, () => {
  console.log(`🚀 App listening ${port}`);
});
