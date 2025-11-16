"use client";
import { JSX, useEffect, useRef, useState } from "react";
import Select from "../_components/Select";
import "../styles/easyCourses.css";
import type { EasyCourse } from "../types";

export default function EasyCoursesPage() {
    //departments variables
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [departmentArray, setDepartmentArray] = useState<string[]>([]);
    //years
    const [yearArray, setYearArray] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("");
    //courses variables
    const courseLevels: string[] = ["all", "100", "200", "300", "400", "500"];
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    //courses data map
    const [easyCoursesMap, setEasyCoursesMap] = useState<Map<string, EasyCourse[]>>(new Map());
    //button clicked
    const [attemptedFetch, setAttemptedFetch] = useState<boolean>(false);

    // On component mount, fetch the list of departments
    useEffect(() => {
        const fetchData = async () => {
            const departmentRes = await fetch("http://localhost:3001/department");
            const departmentData = await departmentRes.json();
            setDepartmentArray(departmentData.map((dept: { dept_name: string }) => dept.dept_name).splice(1));
            setSelectedDepartment(departmentData[1]?.dept_name || "");

            const yearRes = await fetch("http://localhost:3001/year");
            const yearData = await yearRes.json();
            const reversedYearData: string[] = yearData.map((curr_num: {year: number}) => curr_num.year.toString()).reverse();
            setYearArray(reversedYearData);
            setSelectedYear(reversedYearData[0] || "");
        };
        fetchData();
    }, []);

    async function findEasyCourseHandler(): Promise<void> {
        const fetchEasyCourses = async () => {
            const easyCoursesRes = await fetch(
                `http://localhost:3001/statistics/easy?department=${selectedDepartment}&level=${selectedLevel}&year=${selectedYear}`
            );
            const easyCoursesData: EasyCourse[] = await easyCoursesRes.json(); 
            const copiedArray: EasyCourse[] = [...easyCoursesData]; // Create a copy to manipulate
            const newArray: Map<string, EasyCourse[]> = new Map(); // Map to group courses by "SUBJ_CD COURSE_NBR" Ex: all "CS 101" grouped together
            while (copiedArray.length) {
                const currentSubjectName = copiedArray.at(0)?.subj_cd;
                const currentCourseNumber = copiedArray.at(0)?.course_nbr;
                const currentKey = `${currentSubjectName} ${currentCourseNumber}`;
                // Initialize the array for this key if it doesn't exist
                if (!newArray.has(currentKey)) {
                    newArray.set(currentKey, []);
                }
                newArray.get(currentKey)?.push(copiedArray.at(0)!); //push the current course {subj_cd, course_nbr, ...} 
                copiedArray.splice(0, 1); //Remove the processed course from the copy array
            }
            setEasyCoursesMap(newArray);
        };
        fetchEasyCourses();
        setAttemptedFetch(true);
    }

    function getGpaColor(gpa: number): string {
        // Green at 4.0 and yellow at 3.0
        const red = Math.min(255, Math.round((4.0 - gpa) * 255));
        const green = Math.min(255, Math.round((gpa - 1.0) * 110));
        return `rgb(${red}, ${green}, 0)`;
    }

    function renderTable(): JSX.Element {
        const easyCoursesArray = Array.from(easyCoursesMap.entries()); //Format [[key, value], [key, value], ...]
        return (
            <div className="flex flex-col">
                {(easyCoursesMap.size > 0) && (
                        easyCoursesArray.map(([courseKey, courses], index) => (
                            <table className="courses-table" key={`${courseKey}-${index}`}>
                                    <thead>
                                        <tr>
                                            <th id={courseKey} className="course-subject-number-header" colSpan={2}>
                                                {`${courses[0].subj_cd} ${courses[0].course_nbr}: ${courses[0].title}`}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="courses-entries-header-row">
                                            <th>Instructor</th>
                                            <th>Average GPA</th>
                                        </tr>
                            {courses.map((course, index) => (
                                <tr className="courses-entries-row" key={`${courseKey}-${index}`}>
                                            <th>{course.instructor}</th>
                                            <th style={{backgroundColor: getGpaColor(course.avg_gpa) }}>{course.avg_gpa.toFixed(2)}</th>
                                        </tr>
                            ))}
                                    </tbody>
                            </table>
                        ))
                    )
                }
                {(easyCoursesMap.size === 0 && attemptedFetch) && (
                    <p>No easy courses found</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-10">
            <div id="easy-course-filters" className="flex flex-col items-center">
                <Select
                    label="Departments"
                    items={departmentArray}
                    onChange={setSelectedDepartment}
                    value={selectedDepartment}
                    />
                <Select
                    label="Course Levels"
                    items={courseLevels}
                    onChange={setSelectedLevel}
                    value={selectedLevel}
                    />
                <Select
                    label="Minimum Year"
                    items={yearArray}
                    onChange={setSelectedYear}
                    value={selectedYear}
                />
                <button id="easy-course-find-button" onClick={findEasyCourseHandler}>Find</button>
            </div>
            <div className="easy-courses-results-container">
                {renderTable()}
            </div>
        </div>
    );
}
