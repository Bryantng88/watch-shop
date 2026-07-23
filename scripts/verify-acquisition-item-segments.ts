import { prisma } from "../src/server/db/client";

async function main() {
  const [counts, invalid] = await Promise.all([
    prisma.acquisitionItem.groupBy({
      by: ["audienceSegment"],
      _count: { _all: true },
    }),
    prisma.acquisitionItem.count({
      where: { audienceSegment: "UNISEX" },
    }),
  ]);

  console.log(JSON.stringify({ counts, invalidUnisexItems: invalid }, null, 2));
  if (invalid > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
