export type Course = {
  A: number;
  ADV: number;
  B: number;
  C: number;
  CR: number;
  D: number;
  DFR: number;
  F: number;
  I: number;
  NG: number;
  NR: number;
  O: number;
  PR: number;
  S: number;
  U: number;
  W: number;
  course_nbr: string;
  dept_cd: string;
  dept_name: string;
  grade_regs: number;
  id: number;
  instructor: string;
  season: "FA" | "SP" | "SU";
  semester_id: number;
  subj_cd: string;
  title: string;
  year: number;
};

export type EasyCourse = {
    subj_cd: string;
    course_nbr: string;
    title: string;
    instructor: string;
    avg_gpa: number;
};