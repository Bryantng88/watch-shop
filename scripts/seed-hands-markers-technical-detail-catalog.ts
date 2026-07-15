import { prisma } from "../src/server/db/client";

const HANDS_MARKERS_DETAILS = [
  {
    code: "HANDS_ALIGNMENT",
    name: "Can chinh kim lech / cham kim",
    description: "Can chinh lai bo kim khi kim lech, cham nhau hoac cham mat so.",
    sortOrder: 10,
  },
  {
    code: "HANDS_LOOSE",
    name: "Kim long / tuot chan kim",
    description: "Xu ly kim long, tuot chan kim hoac khong bam truc.",
    sortOrder: 20,
  },
  {
    code: "HANDS_REPLACE",
    name: "Thay bo kim",
    description: "Thay mot hoac nhieu kim khi kim hong, cong, sai mau hoac sai form.",
    sortOrder: 30,
  },
  {
    code: "HANDS_RELUME",
    name: "Phuc hoi da quang kim",
    description: "Relume hoac sua da quang tren kim.",
    sortOrder: 40,
  },
  {
    code: "HANDS_CLEAN_OXIDATION",
    name: "Ve sinh / xu ly oxy hoa kim",
    description: "Ve sinh, xu ly vet oxy hoa hoac xuong mau tren kim.",
    sortOrder: 50,
  },
  {
    code: "MARKER_REATTACH",
    name: "Gan lai coc so",
    description: "Gan lai coc so bi roi, long hoac bong khoi mat so.",
    sortOrder: 60,
  },
  {
    code: "MARKER_ALIGNMENT",
    name: "Can chinh coc so lech",
    description: "Can chinh coc so bi lech vi tri hoac xoay sai huong.",
    sortOrder: 70,
  },
  {
    code: "MARKER_REPLACE",
    name: "Thay coc so",
    description: "Thay coc so bi mat, gay, sai mau hoac khong phu hop.",
    sortOrder: 80,
  },
  {
    code: "MARKER_RELUME",
    name: "Phuc hoi da quang coc",
    description: "Relume hoac sua da quang tren coc so.",
    sortOrder: 90,
  },
  {
    code: "MARKER_MISSING",
    name: "Thieu / mat coc so",
    description: "Danh dau truong hop thieu hoac mat coc so can xu ly tiep.",
    sortOrder: 100,
  },
];

async function main() {
  for (const item of HANDS_MARKERS_DETAILS) {
    await prisma.technicalDetailCatalog.upsert({
      where: { code: item.code },
      update: {
        area: "HANDS_MARKERS",
        name: item.name,
        description: item.description,
        sortOrder: item.sortOrder,
        isActive: true,
      },
      create: {
        area: "HANDS_MARKERS",
        code: item.code,
        name: item.name,
        description: item.description,
        sortOrder: item.sortOrder,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${HANDS_MARKERS_DETAILS.length} HANDS_MARKERS technical details.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
