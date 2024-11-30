import { useEffect, useState } from "react";
import { getMyCoursesInstructor } from "@/interaction";

export const GetMyCoursesInstructor: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]); // Update the type based on the actual structure of your courses

  const renderCourses = async () => {
    try {
      const tx = await getMyCoursesInstructor();
      console.log("tx", tx);
      if (!tx) {
        return null
      }
      setCourses(tx); // Assuming tx is an array of courses
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
      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>
                <strong>Start:</strong> {new Date(course.startTime * 1000).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(course.endTime * 1000).toLocaleString()}
              </p>
              <p>
                <strong>Price:</strong> {course.price} ETH
              </p>
              <p>
                <strong>Instructor:</strong> {course.teacher}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

