import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { format } from "date-fns";
import textRoute from "./routes/textRoute";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import ErrorHandler from "./utils/error-utility-class";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working with TypeScript");
});


app.use("/api", textRoute);

// Error-handling middleware should be added after all other middleware and routes
app.use((err: Error | ErrorHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorMiddleware(err, res);
});


app.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port} at ${format(new Date(),"dd MMM yy HH:mm")} 🎊.`);
});
