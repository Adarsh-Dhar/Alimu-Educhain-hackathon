// app/api/courses/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async( 
  req: NextRequest,
  { params }: { params: { id: string } }
) =>  {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: { id }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const courseId = parseInt(params.id)
      const body = await req.json()
      const { learnerAddress } = body
  
      // Validate inputs
     
  
      if (!courseId ) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
  
      // Check if learner exists
      const learner = await prisma.learner.findUnique({
        where: { walletAddress: learnerAddress },
      })
  
      if (!learner) {
        return NextResponse.json(
          { error: 'Learner not found' },
          { status: 404 }
        )
      }
  
      // Check if course exists and is active
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      })
  
      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }
  
      if (!course.isActive) {
        return NextResponse.json(
          { error: 'Course is not active' },
          { status: 400 }
        )
      }
  
      // Check if enrollment already exists
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          learnerAddress_courseId: {
            learnerAddress,
            courseId,
          },
        },
      })
  
      if (existingEnrollment) {
        return NextResponse.json(
          { error: 'Already enrolled in this course' },
          { status: 400 }
        )
      }
  
      // Check if transaction hash is unique
      
  
      
  
      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          learnerAddress,
          courseId,
          progress: 0,
          enrolledAt: new Date(),
        },
        include: {
          course: {
            select: {
              title: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      })
  
      return NextResponse.json({
        message: 'Successfully enrolled in course',
        enrollment,
      })
    } catch (error) {
      console.error('Error enrolling in course:', error)
      return NextResponse.json(
        { error: 'Failed to enroll in course' },
        { status: 500 }
      )
    }
  }