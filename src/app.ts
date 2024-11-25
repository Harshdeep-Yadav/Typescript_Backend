import cors from "cors";
import dotenv from 'dotenv';
import express from "express";
import { format } from "date-fns";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API Working with TypeScript");
  });

  app.use(cors());
  
app.listen(port, () => {
  console.log(`Server is running on port https://localhost:${port} at ${format(new Date(),"dd MMM yy HH:mm")}`
  );
});
