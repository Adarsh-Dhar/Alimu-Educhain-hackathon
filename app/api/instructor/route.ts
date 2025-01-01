import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ethers } from 'ethers'

const prisma = new PrismaClient()

export const POST = async(req: Request) => {
  try {
    const body = await req.json()
    const { walletAddress, name, bio } = body

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Check if instructor already exists
    const existingInstructor = await prisma.instructor.findUnique({
      where: { walletAddress },
    })

    if (existingInstructor) {
      return NextResponse.json(
        { error: 'Instructor already exists' },
        { status: 400 }
      )
    }

    // Create new instructor
    const instructor = await prisma.instructor.create({
      data: {
        walletAddress,
        name,
        bio,
      },
    })

    return NextResponse.json(instructor)
  } catch (error) {
    console.error('Error creating instructor:', error)
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    )
  }
}
