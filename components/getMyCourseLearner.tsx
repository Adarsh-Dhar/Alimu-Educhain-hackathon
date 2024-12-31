import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios from "axios"

// Course interface remains the same
interface Course {
  id: bigint
  title: string
  description: string
  startTime: bigint
  endTime: bigint
  price: bigint
  teacher: string
}

// Timestamp formatting utility remains the same
export function formatUnixTimestamp(
  timestamp: number | bigint, 
  options: {
    format?: 'full' | 'date' | 'time' | 'relative'
    locale?: string
  } = {}
): string {
  const timestampMs = Number(timestamp) * 1000
  
  if (isNaN(timestampMs)) {
    return 'Invalid Timestamp'
  }

  const {
    format = 'date',
    locale = 'en-US'
  } = options

  const date = new Date(timestampMs)

  switch (format) {
    case 'full':
      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

    case 'date':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

    case 'time':
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

    case 'relative':
      return getRelativeTimeString(timestampMs, locale)

    default:
      return date.toString()
  }
}

// Relative time string utility remains the same
function getRelativeTimeString(timestampMs: number, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = Date.now()
  const diffMs = timestampMs - now

  const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'week', ms: 604800000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 }
  ]

  for (const { unit, ms } of units) {
    if (Math.abs(diffMs) >= ms) {
      return rtf.format(Math.round(diffMs / ms), unit)
    }
  }

  return 'just now'
}

// CourseCard component
const CourseCard: React.FC<Course & { onBuy?: (id: string, price: string) => void }> = ({ 
  id, 
  title, 
  description, 
  startTime, 
  endTime, 
  price
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
        <Button variant="outline" size="sm">View Details</Button>
        <Button 
          variant="destructive" 
          size="sm"
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  )
}

// Main Courses Component
export const GetMyCoursesLearner: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/courses')
      
      // Transform the response data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedCourses = response.data.map((course: any) => ({
        id: BigInt(course.id),
        title: course.title,
        description: course.description,
        startTime: BigInt(Math.floor(new Date(course.startTime).getTime() / 1000)),
        endTime: BigInt(Math.floor(new Date(course.endTime).getTime() / 1000)),
        price: BigInt(course.price),
        teacher: course.teacher
      }))

      setCourses(transformedCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-red-600">
        <p>{error}</p>
        <Button onClick={fetchCourses} className="mt-4">Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Courses</h1>
        <Link href="/instructor/create">
          <Button>Create New Course</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id.toString()} 
              {...course} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GetMyCoursesLearner