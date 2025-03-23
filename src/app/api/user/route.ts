import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 현재 유저 정보 가져오기
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// 유저 생성 또는 업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, username, first_name, last_name, referrer_code } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { id }
    })

    let referrerId = null

    // If referrer code is provided, find the referrer
    if (referrer_code && !user) {
      const referrer = await prisma.user.findUnique({
        where: { referral_code: referrer_code }
      })

      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Generate a random referral code
    const generateReferralCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    // Create or update the user
    if (!user) {
      // Create a new user
      user = await prisma.user.create({
        data: {
          id,
          username,
          first_name,
          last_name,
          referrer_id: referrerId,
          referral_code: generateReferralCode()
        }
      })

      // Create user tasks for the new user
      const tasks = await prisma.task.findMany()
      await Promise.all(
        tasks.map((task) =>
          prisma.userTask.create({
            data: {
              user_id: user!.id,
              task_id: task.id,
              completed: false
            }
          })
        )
      )
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id },
        data: {
          username,
          first_name,
          last_name
        }
      })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Failed to create/update user' }, { status: 500 })
  }
}

// 유저의 클리커 점수 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, clicker_score, betting_score } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateData: any = {}

    if (clicker_score !== undefined) {
      updateData.clicker_score = clicker_score
      updateData.last_click_time = new Date()
    }

    if (betting_score !== undefined) {
      updateData.betting_score = betting_score
    }

    if (Object.keys(updateData).length > 0) {
      // Calculate total score
      const user = await prisma.user.findUnique({
        where: { id },
        select: { clicker_score: true, betting_score: true }
      })

      if (user) {
        const newClickerScore = clicker_score !== undefined ? clicker_score : user.clicker_score
        const newBettingScore = betting_score !== undefined ? betting_score : user.betting_score

        updateData.total_score = newClickerScore + newBettingScore
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData
      })

      return NextResponse.json({ user: updatedUser })
    }

    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  } catch (error) {
    console.error('Error updating user score:', error)
    return NextResponse.json({ error: 'Failed to update user score' }, { status: 500 })
  }
}
