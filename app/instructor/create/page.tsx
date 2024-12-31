"use client"

import { Navbar } from "@/components/navbar";
import { CreateCourse } from "@/components/createCourse";

export default function Home() {
  return (
    <div>
      <Navbar />
      <CreateCourse />
    </div>
  );
}
