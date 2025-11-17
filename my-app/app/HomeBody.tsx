"use client";
import { useEffect } from "react";
import { useStore } from "./store";
import Button from "./_components/Button";
import Select from "./_components/Select";
import SearchableSelect from "./_components/SearchableSelect";

export default function HomeBody() {
  const {
    department,
    setDepartment,
    year,
    setYear,
    term,
    setTerm,
    courseNumber,
    setCourseNumber,
    subj,
    setSubj,
    departments,
    setDepartments,
    years,
    setYears,
    terms,
    setTerms,
    courseNumbers,
    setCourseNumbers,
  } = useStore();

  // initial fetch sets all selections with persistence
  useEffect(() => {
    const fetchInitialData = async () => {
      const deptsRes = await fetch("http://localhost:3001/department");
      const depts: { subj_cd: string; dept_name: string }[] = (
        await deptsRes.json()
      ).slice(1); // removes empty dept at start
      if (!depts.length) return;

      setDepartments(depts);

      // searches for saved department, otherwise defaults to first
      const deptMatch = depts.find(
        (d) => d.subj_cd === subj && d.dept_name === department
      );
      const currentDept = deptMatch ?? depts[0];

      setDepartment(currentDept.dept_name);
      setSubj(currentDept.subj_cd);

      // fetch years
      const yearsRes = await fetch(
        `http://localhost:3001/year?s=${encodeURIComponent(
          currentDept.subj_cd
        )}&d=${encodeURIComponent(currentDept.dept_name)}`
      );
      const yearsData = await yearsRes.json();
      setYears(yearsData);

      // either saved year or most recent year
      const currentYear = yearsData.includes(year) ? year : yearsData[0];
      setYear(currentYear);

      // fetch terms
      const termsRes = await fetch(
        `http://localhost:3001/semesters?department=${encodeURIComponent(
          currentDept.dept_name
        )}&subj=${encodeURIComponent(
          currentDept.subj_cd
        )}&year=${encodeURIComponent(currentYear)}`
      );
      const termsData = await termsRes.json();
      setTerms(termsData);

      // either saved term or most recent term
      const currentTerm = termsData.includes(term) ? term : termsData[0];
      setTerm(currentTerm);

      // fetch courses
      const coursesRes = await fetch(
        `http://localhost:3001/semesters/courses?subj=${encodeURIComponent(
          currentDept.subj_cd
        )}&department=${encodeURIComponent(
          currentDept.dept_name
        )}&year=${encodeURIComponent(currentYear)}&season=${encodeURIComponent(
          currentTerm
        )}`
      );
      const coursesData = await coursesRes.json();
      setCourseNumbers(coursesData);

      // either saved course or first course
      const currentCourse = coursesData.includes(courseNumber)
        ? courseNumber
        : coursesData[0];
      setCourseNumber(currentCourse);
    };

    fetchInitialData();
  }, []);

  // fetch years available for department
  useEffect(() => {
    if (!subj || !department) return;

    const fetchYears = async () => {
      const res = await fetch(
        `http://localhost:3001/year?s=${encodeURIComponent(
          subj
        )}&d=${encodeURIComponent(department)}`
      );
      const data = await res.json();
      setYears(data);
      const newYear = data.includes(year) ? year : data[0];
      setYear(newYear);
    };

    fetchYears();
  }, [subj, department]);

  // fetch terms available for department and year
  useEffect(() => {
    if (!subj || !year || !department) return;

    const fetchTerms = async () => {
      const res = await fetch(
        `http://localhost:3001/semesters?department=${encodeURIComponent(
          department
        )}&subj=${encodeURIComponent(subj)}&year=${encodeURIComponent(year)}`
      );
      const data = await res.json();
      setTerms(data);
      const newTerm = data.includes(term) ? term : data[0];
      setTerm(newTerm);
    };

    fetchTerms();
  }, [subj, year, department]);

  // fetch course numbers available for department, year, and term
  useEffect(() => {
    if (!subj || !year || !term || !department) return;

    const fetchCourses = async () => {
      const res = await fetch(
        `http://localhost:3001/semesters/courses?subj=${encodeURIComponent(
          subj
        )}&department=${encodeURIComponent(
          department
        )}&year=${encodeURIComponent(year)}&season=${encodeURIComponent(term)}`
      );
      const data = await res.json();
      setCourseNumbers(data);
      const newCourse = data.includes(courseNumber) ? courseNumber : data[0];
      setCourseNumber(newCourse);
    };

    fetchCourses();
  }, [subj, year, term, department]);

  return (
    <div>
      <Button href="./easyCourses">Find Easy Courses</Button>
      <div className="flex flex-col gap-3 border w-fit p-6 my-10">
        {departments.length > 0 && (
          <SearchableSelect
            label="Departments"
            items={departments}
            value={
              departments.find(
                (d) => d.subj_cd === subj && d.dept_name === department
              ) ?? departments[0]
            } // initial value either saved or first
            getOptionText={(d) => `${d.dept_name} - ${d.subj_cd}`} //format for the options list
            onChange={(d) => {
              setDepartment(d.dept_name);
              setSubj(d.subj_cd);
            }}
          />
        )}

        <Select label="Year" items={years} value={year} onChange={setYear} />
        <Select label="Terms" items={terms} value={term} onChange={setTerm} />
        <Select
          label="Course Numbers"
          items={courseNumbers}
          value={courseNumber}
          onChange={setCourseNumber}
        />
        <Button
          href={`./graph?d=${subj}&t=${term}&y=${year}&n=${courseNumber}`}
        >
          Get Graph
        </Button>
      </div>
    </div>
  );
}
