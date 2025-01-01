import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ethers } from 'ethers'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { walletAddress, name } = body

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      )
    }

    // Check if learner already exists
    const existingLearner = await prisma.learner.findUnique({
      where: { walletAddress },
    })

    if (existingLearner) {
      return NextResponse.json(
        { error: 'Learner already exists' },
        { status: 400 }
      )
    }

    // Create new learner
    const learner = await prisma.learner.create({
      data: {
        walletAddress,
        name,
      },
    })

    return NextResponse.json(learner)
  } catch (error) {
    console.error('Error creating learner:', error)
    return NextResponse.json(
      { error: 'Failed to create learner' },
      { status: 500 }
    )
  }
}