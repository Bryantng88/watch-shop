import fs from "fs";

const raw = JSON.parse(
    fs.readFileSync("data.json", "utf8") // file tải từ github
);

const TARGETS: Record<string, string> = {
    "01": "Thành phố Hà Nội",
    "79": "Thành phố Hồ Chí Minh",
};
const result = [];

for (const city of raw.cities) {
    if (!TARGETS[city.Id]) continue;

    const locals = [];

    for (const district of city.Districts) {
        for (const ward of district.Wards) {
            let type = "WARD";

            if (ward.Name.startsWith("Xã")) type = "COMMUNE";
            if (ward.Name.startsWith("Thị trấn")) type = "TOWNSHIP";

            locals.push({
                code: ward.Id,
                name: ward.Name,
                type,
            });
        }
    }

    result.push({
        code: city.Id,
        name: city.Name,
        locals,
    });
}

fs.writeFileSync(
    "public/locations/hn-hcm-2-level.json",
    JSON.stringify(result, null, 2)
);