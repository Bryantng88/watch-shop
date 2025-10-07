import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



async function main() {
    await prisma.product.update({
        where: { id: 'cmgexdcfh0003vkz4u5cm6gsr' },
        data: { primaryImageUrl: "http://longnd.myqnapcloud.com:8253/share.cgi/0001-251554421167544185%201.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758272903658&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0001-251554421167544185%201.png" },
    });



    console.log('✅ Update thành công');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());