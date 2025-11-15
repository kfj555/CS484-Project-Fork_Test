import HomeBody from "./HomeBody";

const Home = async () => {
  // fetch list of departments and years in db
  const [departmentsRes, yearsRes] = await Promise.all([
    fetch("http://localhost:3001/department"),
    fetch("http://localhost:3001/year"),
  ]);
  const departmentsD = await departmentsRes.json();
  const years: { year: number }[] = await yearsRes.json();
  const departments: { dept_name: string }[] = departmentsD.splice(1); // gets rid of empty response
  
  // fetch course numbers list based on first department
  const numsRes = await fetch(
    `http://localhost:3001/course?department=${departments[0].dept_name}`
  );
  const nums: { course_nbr: string }[] = await numsRes.json();
  
  return (
    <div className="flex items-center justify-center w-full">
      <HomeBody departments={departments} years={years} cNums={nums} />
    </div>
  );
};

export default Home;
