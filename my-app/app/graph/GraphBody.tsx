"use client";
import { ChartData, Chart as ChartJS, ChartOptions } from "chart.js/auto"; // include /auto
import { Bar } from "react-chartjs-2";
import { Course } from "@/app/types";

void ChartJS; // prevents from being tree-shaken

// maps season abbreviations to full names
const seasonMap: { [key: string]: string } = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
};

const GraphBody = ({ data }: { data: Course[] }) => {
  const chartData: ChartData<"bar">[] = data.map((course, index) => ({
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        data: [course.A, course.B, course.C, course.D, course.F],
        borderWidth: 1,
        backgroundColor: "rgba(212, 31, 11, .7)",
        borderColor: "rgba(212, 31, 11,.7)",
        borderRadius: 10,
        hoverBackgroundColor: "rgba(212, 31, 11,1)",
      },
    ],
  }));
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: false,
        text: `${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`,
        font: { size: 22 },
      },
      legend: { display: false },
    },
    scales: {
      x: {
        title: { text: "Grade", display: true, font: { size: 16 } },
      },
      y: {
        title: { text: "# of students", display: true, font: { size: 16 } },
      },
    },
  };

  return (
    <div className="flex flex-col w-200 gap-7">
      {/* Title */}
      <div>
        <h1 className="text-lg font-semibold justify-self-center">{`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}</h1>
        <h2 className="justify-self-center">{`${seasonMap[data[0].season]} ${
          data[0].year
        }`}</h2>
      </div>
      {/* Graphs */}
      {chartData.map((cData, index) => {
        const { A, B, C, D, grade_regs, W } = data[index];
        return (
          <div key={index} className="border-1 mx-3 p-3">
            <Bar data={cData} options={chartOptions} />
            {/* Extra Details */}
            <div className="pl-15">
              <p>Professor: {data[index].instructor}</p>
              <p>Total Registrations: {grade_regs}</p>
              <p>
                {`Average GPA: ${(
                  (4 * A + 3 * B + 2 * C + D) /
                  grade_regs
                ).toFixed(2)}`}
              </p>
              <p>Withdraws: {W}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GraphBody;
