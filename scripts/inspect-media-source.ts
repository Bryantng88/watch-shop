import "dotenv/config";
import { mediaStorage } from "../src/domains/media/storage";
import { browseMediaFolder } from "../src/domains/media/server/nas-media.service";

async function inspect(prefix: string) {
  const result = await mediaStorage.list({
    prefix: prefix ? `${prefix}/` : undefined,
    delimiter: "/",
    maxKeys: 100,
  });

  return {
    prefix,
    folders: result.prefixes,
    files: result.items.map((item) => item.key),
    truncated: result.truncated,
  };
}

async function main() {
  const [results, recursiveMedia, appBrowse] = await Promise.all([
    Promise.all([
    inspect(""),
    inspect("media"),
    inspect("media/men"),
    inspect("media/men/inline"),
    inspect("media/women"),
    inspect("media/women/inline"),
    ]),
    mediaStorage.list({
      prefix: "media/",
      maxKeys: 200,
    }),
    browseMediaFolder({
      profile: "inline",
      segment: "MEN",
      prefix: "media/men/inline",
    }),
  ]);

  console.log(JSON.stringify({
    levels: results,
    recursiveMediaKeys: recursiveMedia.items.map((item) => item.key),
    appBrowse: {
      folders: appBrowse.folders,
      files: appBrowse.files.map((item) => item.key),
      total: appBrowse.total,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
