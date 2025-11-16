import HomeBody from "./HomeBody";

// use env var with fallback so backend URL can be configured without code edits
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const Home = async () => {
  try {
    const [departmentsRes, yearsRes] = await Promise.all([
      fetch(`${BASE}/department`),
      fetch(`${BASE}/year`),
    ]);

    const departmentsD = await departmentsRes.json();
    const years: { year: number }[] = await yearsRes.json();
    const departments: { dept_name: string }[] = departmentsD.splice(1);

    
    const numsRes = await fetch(
      `${BASE}/course?department=${encodeURIComponent(departments[0].dept_name)}`
    );
    const nums: { course_nbr: string }[] = await numsRes.json();

    return (
      <div className="flex items-center justify-center w-full">
        <HomeBody departments={departments} years={years} cNums={nums} />
      </div>
    );
  } catch (err) {
    return (
      <div style={{ padding: 16 }}>
        <p>Backend unavailable. Start the server at {BASE}.</p>
      </div>
    );
  }
};

export default Home;
