import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]/route";

/**
 * @swagger
 * /api/wishes/{id}/unreserve:
 *   post:
 *     summary: Unreserve a wish
 *     tags: [Wishes]
 *     security:
 *       - NextAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wish ID
 *     responses:
 *       200:
 *         description: Wish unreserved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to unreserve this wish
 *       404:
 *         description: Wish not found
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const wish = await prisma.wish.findUnique({
    where: { id: params.id },
  });

  if (!wish) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Проверяем, что пользователь отменяет свою собственную резервацию
  if (wish.reservedBy !== user!.id) {
    return NextResponse.json(
      { error: "You can only cancel your own reservation" },
      { status: 403 }
    );
  }

  const updatedWish = await prisma.wish.update({
    where: { id: params.id },
    data: {
      status: "UNRESERVED",
      reservedBy: null,
    },
  });

  return NextResponse.json(updatedWish);
}