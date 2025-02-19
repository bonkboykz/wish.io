import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * @swagger
 * /api/wishes/reserved:
 *   get:
 *     summary: Get all wishes reserved by the current user
 *     tags: [Wishes]
 *     security:
 *       - NextAuth: []
 *     responses:
 *       200:
 *         description: List of reserved wishes
 *       401:
 *         description: Unauthorized
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      reservedWishes: {
        include: {
          wishLists: {
            include: {
              wishList: {
                select: {
                  title: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user.reservedWishes);
}