import prisma from "$lib/prisma";

export async function getBorder(
    from,
    to
) {
    const fromDate = new Date(from);
    fromDate.setDate(fromDate.getDate() - 1);
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    if (isNaN(fromDate) || isNaN(toDate)) {
        return [];
    }
    // TODO: ちょっと余裕持って取得
    const borders = await prisma.border.findMany({
        where: {
            AND: [
                {
                    createdAt: {
                        lte: toDate
                    }
                },
                {
                    createdAt: {
                        gte: fromDate
                    }
                }
            ]
        }
    });
    return borders;
}