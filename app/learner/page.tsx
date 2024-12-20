"use client"
import CourseCard from "@/components/courses";
import GetMyCoursesLearner from "@/components/getMyCourseLearner";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <GetMyCoursesLearner />
    </div>
  );
}
