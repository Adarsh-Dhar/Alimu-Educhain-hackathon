import React, { useEffect, useState } from "react";
import { interaction } from "@/interaction";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// Timestamp formatting utility
export function formatUnixTimestamp(
  timestamp: number | bigint, 
  options: {
    format?: 'full' | 'date' | 'time' | 'relative';
    locale?: string;
  } = {}
): string {
  // Ensure timestamp is a number and convert from seconds to milliseconds
  const timestampMs = Number(timestamp) * 1000;
  
  // Validate timestamp
  if (isNaN(timestampMs)) {
    return 'Invalid Timestamp';
  }

  const {
    format = 'date',
    locale = 'en-US'
  } = options;

  const date = new Date(timestampMs);

  // Different formatting based on option
  switch (format) {
    case 'full':
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

    case 'date':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

    case 'time':
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

    case 'relative':
      return getRelativeTimeString(timestampMs, locale);

    default:
      return date.toString();
  }
}

// Relative time string utility
function getRelativeTimeString(timestampMs: number, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = Date.now();
  const diffMs = timestampMs - now;

  const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'week', ms: 604800000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 }
  ];

  for (const { unit, ms } of units) {
    if (Math.abs(diffMs) >= ms) {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }

  return 'just now';
}

// CourseCard component
const CourseCard: React.FC<Course & { onBuy?: (id: string, price: string) => void }> = ({ 
  id, 
  title, 
  description, 
  startTime, 
  endTime, 
  price, 
  onBuy 
}) => {
  return (
    <Card className="max-w-sm border shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <div>
          <strong>Start:</strong> {formatUnixTimestamp(startTime, { format: 'full' })}
        </div>
        <div>
          <strong>End:</strong> {formatUnixTimestamp(endTime, { format: 'full' })}
        </div>
        <div>
          <strong>Price:</strong> {Number(price) / 1e18} ETH
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" size="sm">Edit</Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onBuy && onBuy(id.toString(), (Number(price) / 1e18).toString())}
        >
          Buy
        </Button>
      </CardFooter>
    </Card>
  );
};


// Main Courses Component
export const GetAllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { getAllCourses, buyCourse } = interaction();

  const renderCourses = async () => {
    try {
      const tx = await getAllCourses();
      if (!tx) {
        return null;
      }
      
      // Transform the tx array into Course objects
      const transformedCourses = tx.map((item: any) => ({
        id: item[0],
        title: item[1],
        description: item[2],
        startTime: item[3],  // Corrected to use index 3
        endTime: item[4],    // Corrected to use index 4
        price: item[5],
        teacher: item[6]
      }));

      console.log("Transformed Courses:", transformedCourses);
      setCourses(transformedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleBuyCourse = async (courseId: string, price: string) => {
    try {
      await buyCourse(courseId, price);
      // Refresh the courses list after purchase
      await renderCourses();
    } catch (error) {
      console.error("Error buying course:", error);
    }
  };

  useEffect(() => {
    renderCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Link href="/instructor/create">
          <Button>Create New Course</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No courses available. Create your first course!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
  <CourseCard 
    key={course.id.toString()} 
    {...course} 
    onBuy={handleBuyCourse}
  />
))}
        </div>
      )}
    </div>
  );
};

export default GetAllCourses;