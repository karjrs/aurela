import { ClosingStatement } from "@/components/landing/ClosingStatement";
import { DayMoments } from "@/components/landing/DayMoments";
import { Hero } from "@/components/landing/Hero";

const Home = () => {
  return (
    <div className="bg-day-arc flex flex-1 flex-col">
      <Hero />
      <DayMoments />
      <ClosingStatement />
    </div>
  );
};

export default Home;
