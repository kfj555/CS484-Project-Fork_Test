"use client";
import { useEffect, useState } from "react";
import Button from "./_components/Button";
import Select from "./_components/Select";

// TODO: make this page type safe

export default function HomeBody({
  departments = [{ dept_name: "" }],
  years = [{ year: -1 }],
  cNums = [{ course_nbr: "" }],
}) {
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  // department, term, year, and course num used for querying
  const [department, setDepartment] = useState<string>(
    departments[0].dept_name ?? ""
  );
  const [year, setYear] = useState<number>(years[0].year ?? 0);
  const [term, setTerm] = useState<string>("FA");
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(
    cNums[0].course_nbr ?? ""
  );
  const [availableCourseNumbers, setAvailableCourseNumbers] = useState<
    string[]
  >(cNums.map((c) => c.course_nbr) ?? []);
  // When department or year change, fetch available seasons and set a default term
  useEffect(() => {
    // When department or year change, fetch available seasons and set a default term
    const fetchSeasons = async () => {
      if (department === "") return;

      const availableTermsRes = await fetch(
        `${BASE}/semesters?department=${department}&year=${year}`
      );
      const availableSeasonsData: string[] = await availableTermsRes.json();
      setAvailableSeasons(availableSeasonsData);
      const defaultTerm = availableSeasonsData[0] ?? "FA";
      setTerm(defaultTerm);
    };
    fetchSeasons();
  }, [department, year]);

  // When department, year, or term changes, fetch course numbers for the chosen season
  useEffect(() => {
    const fetchCourses = async () => {
      if (department === "") return;
      const seasonToUse = term ?? availableSeasons[0] ?? "FA";

      const availableCourseNumbersRes = await fetch(
        `${BASE}/semesters/courses?department=${department}&year=${year}&season=${seasonToUse}`
      );
      const availableCourseNumbersData: string[] =
        await availableCourseNumbersRes.json();
      setAvailableCourseNumbers(availableCourseNumbersData);
      setSelectedCourse(availableCourseNumbersData[0] ?? "");
    };
    fetchCourses();
  }, [department, year, term, availableSeasons]);

  return (
    <div>
      <Button href="./easyCourses">Find Easy Courses</Button>
      <div className="flex flex-col gap-3 border-1 w-fit p-6 my-10">
        <Select
          label="Departments"
          items={departments}
          onChange={setDepartment}
          value={department}
        />
        <Select
          label="Terms"
          items={availableSeasons}
          onChange={setTerm}
          value={term}
        />
        <Select label="Year" items={years} onChange={setYear} value={year} />
        <Select
          label="Course Numbers"
          items={availableCourseNumbers}
          onChange={setSelectedCourse}
          value={selectedCourse}
        />
        <Button
          href={`./graph?d=${department}&t=${term}&y=${year}&n=${selectedCourse}`}
        >
          Get Graph
        </Button>
      </div>
    </div>
  );
}
