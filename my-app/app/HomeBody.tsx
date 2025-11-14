"use client";
import { useEffect, useState } from "react";
import Button from "./_components/Button";
import Select from "./_components/Select";

// TODO: make this page type safe

// for readability purposes, maps full term names to abbreviations used in DB queries
const termMap: { [key: string]: string } = {
  Fall: "FA",
  Spring: "SP",
  Summer: "SU",
};

export default function HomeBody({ departments = [], years = [], cNums = [] }) {
  // department, term, year, and course num used for querying
  const [department, setDepartment] = useState(departments[0].dept_name ?? "");
  const [year, setYear] = useState(years[0].year ?? 0);
  const [term, setTerm] = useState("Fall");
  const terms = ["Fall", "Spring", "Summer"];
  const [num, setNum] = useState(cNums[0].course_nbr ?? 0);
  const [nums, setNums] = useState<{ course_nbr: number }[]>(cNums);

  // useEffect updates list of course numbers every time department changes
  useEffect(() => {
    const fetchData = async () => {
      if (department === "") return;

      const numRes = await fetch(
        `http://localhost:3001/course?department=${department}`
      );
      const numData = await numRes.json();

      setNums(numData);
      if (numData.length > 0) {
        setNum(Number(numData[0].course_nbr));
      } else {
        setNum(0);
      }
    };
    fetchData();
  }, [department]);

  return (
    <div className="flex flex-col gap-3 border-1 w-fit p-6 my-10">
      <Select
        label="Departments"
        items={departments}
        onChange={setDepartment}
      />
      <Select label="Terms" items={terms} onChange={setTerm} />
      <Select label="Year" items={years} onChange={setYear} />
      <Select label="Course Numbers" items={nums} onChange={setNum} />
      <Button
        href={`./graph?d=${department}&t=${termMap[term]}&y=${year}&n=${num}`}
      >
        Get Graph
      </Button>
    </div>
  );
}
