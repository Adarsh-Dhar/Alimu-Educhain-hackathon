import { useEffect, useState } from "react";
import { interaction } from "@/interaction";
import { Button } from "./ui/button";
import Link from "next/link";

// Define a type for the Course structure
interface Course {
  id: bigint;
  title: string;
  description: string;
  startTime: bigint;
  endTime: bigint;
  price: bigint;
  teacher: string;
}

export const GetMyCoursesInstructor: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]); 
  const {getMyCoursesInstructor, deleteCourse} = interaction()

  const renderCourses = async () => {
    try {
      const tx = await getMyCoursesInstructor();
      console.log("tx", tx);
      if (!tx) {
        return null
      }
      setCourses(tx); 
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    renderCourses();
  }, []);

  return (
    <div>
      <h1>My Courses</h1>
      <Link href="/instructor/create">
        <Button>Create New</Button>
      </Link>
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>
                <strong>Start:</strong> {new Date(Number(course.startTime) * 1000).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(Number(course.endTime) * 1000).toLocaleString()}
              </p>
              <p>
                <strong>Price:</strong> {course.price.toString()} ETH
              </p>
              <p>
                <strong>Instructor:</strong> {course.teacher}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div>
        <Button onClick={() => {
          deleteCourse("0")
        }}>Delete</Button>
      </div>
    </div>
  );
};