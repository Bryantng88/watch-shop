import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
const parsed = databaseUrl ? new URL(databaseUrl) : null;

if (!parsed || !["127.0.0.1", "localhost", "::1"].includes(parsed.hostname)) {
  throw new Error("Demo Watch seed chỉ được chạy trên database loopback local.");
}
if (!/(test|local|storefront)/i.test(parsed.pathname)) {
  throw new Error("Tên database local phải chứa test, local hoặc storefront.");
}

const fixtures = [
  { id: "local-demo-watch-rolex-datejust", slug: "local-elgin-ufo-automatic", sku: "LOCAL-LGN-001", title: "Elgin U.F.O Automatic", audience: "MEN", status: "AVAILABLE", saleStage: "READY", stockStage: "IN_STOCK", style: "CLASSIC", price: 4_900_000, cost: 3_200_000, model: "U.F.O", ref: "", size: 36, year: "1970s" },
  { id: "local-demo-watch-cartier-panthere", slug: "local-cartier-panthere", sku: "LOCAL-CTP-002", title: "Cartier Panthère Small", audience: "WOMEN", status: "AVAILABLE", saleStage: "READY", stockStage: "IN_STOCK", style: "DRESS", price: 138_000_000, cost: 108_000_000, model: "Panthère Small", ref: "WSPN0013", size: 27, year: "2021" },
  { id: "local-demo-watch-tudor-black-bay", slug: "local-tudor-black-bay-58", sku: "LOCAL-TBB58-003", title: "Tudor Black Bay 58", audience: "MEN", status: "AVAILABLE", saleStage: "READY", stockStage: "IN_STOCK", style: "SPORT", price: 108_000_000, cost: 84_000_000, model: "Black Bay 58", ref: "79030N", size: 39, year: "2020" },
  { id: "local-demo-watch-omega-sold", slug: "local-omega-constellation-sold", sku: "LOCAL-OMG-004", title: "Omega Constellation Vintage", audience: "UNISEX", status: "SOLD", saleStage: "SOLD", stockStage: "OUT_OF_STOCK", style: "CLASSIC", price: 86_000_000, cost: 61_000_000, model: "Constellation", ref: "168.005", size: 34, year: "1972" },
] as const;

async function main() {
  const { prisma } = await import("../src/server/db/client");

  try {
  const brand = await prisma.brand.upsert({
    where: { slug: "local-demo-brand" },
    update: { name: "Local Demo Brand" },
    create: { id: "local-demo-brand", slug: "local-demo-brand", name: "Local Demo Brand" },
  });

  for (const item of fixtures) {
    const product = await prisma.product.upsert({
      where: { id: item.id },
      update: { title: item.title, slug: item.slug, sku: item.sku, status: item.status, brandId: brand.id },
      create: {
        id: item.id,
        slug: item.slug,
        sku: item.sku,
        title: item.title,
        type: "WATCH",
        status: item.status,
        brandId: brand.id,
        contentStatus: "DRAFT",
        watch: {
          create: {
            audienceSegment: item.audience,
            mediaPipelineKey: item.audience === "WOMEN" ? "WOMEN_LITE" : item.audience === "UNISEX" ? "UNISEX_STANDARD" : "MEN_STANDARD",
            saleStage: item.saleStage,
            stockStage: item.stockStage,
            serviceStage: "NOT_REQUIRED",
            siteChannel: "LUXURY",
            style: item.style,
            yearText: item.year,
            conditionGrade: "Excellent",
            specStatus: "READY",
            watchPrice: { create: { costPrice: item.cost, landedCost: item.cost, listPrice: item.price, salePrice: item.price } },
            watchSpecV2: { create: { brand: "Local Demo Brand", model: item.model, referenceNumber: item.ref, caseSizeMM: item.size, movementType: "AUTOMATIC", dialColor: "Champagne", calibre: "Demo calibre" } },
          },
        },
      },
      include: { watch: { select: { id: true } } },
    });

    if (item.id === "local-demo-watch-rolex-datejust" && product.watch) {
      await prisma.watch.update({
        where: { id: product.watch.id },
        data: { audienceSegment: "MEN", mediaPipelineKey: "MEN_STANDARD" },
      });
      await prisma.watchSpecV2.update({
        where: { watchId: product.watch.id },
        data: {
          brand: "Elgin", model: "U.F.O", referenceNumber: "UFO-360", nickname: "Green TV Dial",
          caseShape: "SQUARE", caseSizeMM: 36, lugToLugMM: 36,
          lugWidthMM: 20, thicknessMM: 11.5,
          materialProfile: "SINGLE_MATERIAL",
          primaryCaseMaterial: "STAINLESS_STEEL",
          secondaryCaseMaterial: null,
          goldTreatment: null,
          goldColors: [],
          goldKarat: null,
          materialNote: "Stainless-steel tonneau/TV case with integrated bracelet",
          dialColor: "Green",
          dialFinish: "Sunburst", crystal: "MINERAL", movementType: "AUTOMATIC",
          calibre: "Elgin signed automatic", powerReserve: "Approximately 40 hours",
          waterResistance: "Vintage watch — not pressure tested",
          braceletType: "BRACELET", strapMaterialText: "Integrated stainless-steel bracelet",
          buckleType: "Folding clasp",
          bookletIncluded: true, cardIncluded: true, boxIncluded: true,
          strapSetType: "BRAND_ORIGINAL", strapComponentSource: "KEEP_CURRENT",
          featuresJson: {
            complications: ["Day", "Date"],
            dialMarkers: "Applied baton indexes",
            secondsDisplay: "Central seconds",
            vintage: true,
          },
          rawSpecJson: {
            testFixture: "full-spec",
            condition: "Excellent",
            productionPeriod: "1970s",
            notes: "Demo data for validating the complete specification UI",
          },
        },
      });
      await prisma.watchContent.upsert({
        where: { watchId: product.watch.id },
        update: {
          titleOverride: "1970s Elgin U.F.O Automatic",
          hookText: "Tiệm có giá chưa tới 5 triệu, rất dễ tiếp cận cho chiếc Elgin thú vị này. Anh em vui lòng inbox để lấy giá tốt nhất.",
          body: "Có những thiết kế chỉ đẹp ở thời điểm chúng ra mắt. Nhưng cũng có những thiết kế phải cần vài chục năm để người ta nhận ra giá trị. Chiếc Elgin này thuộc về vế thứ hai.\n\nĐiều mình thích nhất là sự táo bạo. Bộ vỏ UFO/TV bo tròn, mặt số xanh rêu độc đáo cùng ô lịch day-date đặt dọc tạo nên một tổng thể rất \"70s\". Đây không phải kiểu đồng hồ cố gắng chiều lòng tất cả mọi người, mà là một thiết kế có cá tính rất rõ.\n\nChính điều đó làm đồng hồ vintage trở nên thú vị. Những gì từng bị xem là quá khác biệt, quá phóng khoáng, theo thời gian lại trở thành thứ có giá trị nhất. Bởi xu hướng sẽ thay đổi, nhưng một thiết kế có bản sắc thì luôn ở lại.\n\n👉 Có lẽ những chiếc đồng hồ sáng tạo nhất chưa bao giờ dành cho số đông. Nhưng cũng chính vì thế mà chúng già đi đẹp hơn bất kỳ xu hướng nào.",
          bulletSpecs: ["Model U.F.O.", "Bộ máy automatic.", "Kích thước 36x36mm.", "Chất liệu vỏ thép không gỉ.", "Kính mineral.", "Phong cách futuristic."],
          hashTags: "#LGN04082026001 #vintagewatch #FUTURISTIC #Elgin",
          contentStatus: "DRAFT",
        },
        create: {
          watchId: product.watch.id,
          titleOverride: "1970s Elgin U.F.O Automatic",
          hookText: "Tiệm có giá chưa tới 5 triệu, rất dễ tiếp cận cho chiếc Elgin thú vị này. Anh em vui lòng inbox để lấy giá tốt nhất.",
          body: "Có những thiết kế chỉ đẹp ở thời điểm chúng ra mắt. Nhưng cũng có những thiết kế phải cần vài chục năm để người ta nhận ra giá trị. Chiếc Elgin này thuộc về vế thứ hai.\n\nĐiều mình thích nhất là sự táo bạo. Bộ vỏ UFO/TV bo tròn, mặt số xanh rêu độc đáo cùng ô lịch day-date đặt dọc tạo nên một tổng thể rất \"70s\". Đây không phải kiểu đồng hồ cố gắng chiều lòng tất cả mọi người, mà là một thiết kế có cá tính rất rõ.\n\nChính điều đó làm đồng hồ vintage trở nên thú vị. Những gì từng bị xem là quá khác biệt, quá phóng khoáng, theo thời gian lại trở thành thứ có giá trị nhất. Bởi xu hướng sẽ thay đổi, nhưng một thiết kế có bản sắc thì luôn ở lại.\n\n👉 Có lẽ những chiếc đồng hồ sáng tạo nhất chưa bao giờ dành cho số đông. Nhưng cũng chính vì thế mà chúng già đi đẹp hơn bất kỳ xu hướng nào.",
          bulletSpecs: ["Model U.F.O.", "Bộ máy automatic.", "Kích thước 36x36mm.", "Chất liệu vỏ thép không gỉ.", "Kính mineral.", "Phong cách futuristic."],
          hashTags: "#LGN04082026001 #vintagewatch #FUTURISTIC #Elgin",
          contentStatus: "DRAFT",
        },
      });

      await prisma.productImage.deleteMany({ where: { productId: item.id } });
      await prisma.productImage.createMany({ data: [
        { productId: item.id, fileKey: "media/objects/918e3e59f5aac372164b88fac64a693e/original/DSCF6340(edited).JPG", role: "GALLERY", sortOrder: 0, isPrimary: true, alt: "Elgin U.F.O Automatic" },
        { productId: item.id, fileKey: "media/objects/a8bf001fe4fff4d3eeef1b95ee719895/original/DSCF6338(edited).JPG", role: "GALLERY", sortOrder: 1, alt: "Elgin U.F.O dial" },
        { productId: item.id, fileKey: "media/objects/a07c8eee6cd844c4dcdfa0ae0bdb7d1f/original/DSCF6320(edited).JPG", role: "GALLERY", sortOrder: 2, alt: "Elgin U.F.O case" },
        { productId: item.id, fileKey: "media/objects/67e7be9d19591358f7a9558fd470bb2b/original/DSCF6319(edited).JPG", role: "GALLERY", sortOrder: 3, alt: "Elgin U.F.O bracelet" },
        { productId: item.id, fileKey: "media/objects/e20d8f4ececc3d6f4140049392a7bc14/original/DSCF6318(edited).JPG", role: "GALLERY", sortOrder: 4, alt: "Elgin U.F.O back" },
      ] });
    }
  }

  console.log(JSON.stringify({ ok: true, database: parsed.pathname.slice(1), watches: fixtures.length }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
