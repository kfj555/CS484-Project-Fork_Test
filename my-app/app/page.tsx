'use client";';
import HomeBody from "./HomeBody";
import { termOptions } from "./types";
import { useStore } from "./store";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <HomeBody />
    </div>
  );
};

export default Home;
