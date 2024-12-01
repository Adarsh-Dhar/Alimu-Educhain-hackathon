"use client"

import GetAllCourses from "@/components/buyCourse";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <GetAllCourses />
    </div>
  );
}
