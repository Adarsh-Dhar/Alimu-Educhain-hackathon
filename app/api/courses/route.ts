import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
    try {
      const courses = await prisma.course.findMany({
        orderBy: {
          startTime: 'desc'
        }
      })
      
      return NextResponse.json(courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }
  }

  export const POST = async (req: NextRequest) => {
    try {
      const body = await req.json()

      const courseData = {
        title: body.title,
        description: body.description,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        price: body.price,
      }
      
      // Validate request body
    //   const validatedData = CourseSchema.parse(body)
      
      // Convert string dates to Date objects
      const course = await prisma.course.create({
        data: {
          ...courseData,
        }
      })
      
      return NextResponse.json(course, { status: 201 })
    } catch (error) {
      
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }
  }
  