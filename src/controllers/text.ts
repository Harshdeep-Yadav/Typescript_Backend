import { NextFunction, Request, Response } from "express";
import { dbQuery } from "../config/db";
import { getOrSetCache } from "../utils/redisHelper";
import { TryCatch } from "../utils/tryCatch";
import ErrorHandler from "../utils/error-utility-class";

export const texts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const DataKey = "WiingyTutorDataBase";

    // Fetching data from cache or database
    const result = await getOrSetCache(DataKey, async () => {
      console.log("Fetching data from database...");
      const query = `SELECT * FROM WiingyTutorDataBase LIMIT 10`;
      return await dbQuery<any[]>(query); // Specify the expected type of results
    });

    // Handle case when no data is found
    if (!result) {
      return next(new ErrorHandler("No data found", 404));
    }
    res.status(200).json({
      message: "Data fetched successfully",
      data: result,
    });
  }
);
