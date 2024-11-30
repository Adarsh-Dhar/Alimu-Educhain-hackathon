"use client"
import CourseCard from "@/components/courses";
import { Navbar } from "@/components/navbar";
import { CreateCourse } from "@/components/createCourse";
import { GetMyCoursesInstructor } from "@/components/getMyCoursesInstructor";

export default function Home() {
  return (
    <div>
      <Navbar />
    <GetMyCoursesInstructor />

    </div>
  );
}
