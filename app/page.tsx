"use client"
import CourseCard from "@/components/courses";

export default function Home() {
  return (
    <CourseCard title="title1" description="description1" image="image1" buttonText="button1" onButtonClick={() => {console.log("hello")}} />
  );
}
