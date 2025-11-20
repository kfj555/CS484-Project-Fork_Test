// server.js
import express from "express";
import cors from "cors";
import { courseRouter } from "./routes/course.js";
import { deptRouter } from "./routes/department.js";
import { yearRouter } from "./routes/year.js";
import { semesterRouter } from "./routes/semesters.js";
import { statisticsRouter } from "./routes/statistics.js";
import { instructorRouter } from "./routes/instructor.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());

app.use("/course", courseRouter);
app.use("/department", deptRouter);
app.use("/year", yearRouter);
app.use("/semesters", semesterRouter);
app.use("/statistics", statisticsRouter);
app.use("/instructor", instructorRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
