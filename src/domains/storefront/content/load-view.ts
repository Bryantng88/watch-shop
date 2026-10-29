import { getArticle, readHome, resolveImages, selectedWatches } from "./service";
export async function loadHomeView(preview = false) {
  const content = await readHome(preview);
  const [images, watches, journal] = await Promise.all([
    resolveImages("home", "HOME", content, preview),
    selectedWatches(content.featured.productIds, true),
    content.journal.articleId
      ? getArticle(content.journal.articleId, preview)
      : Promise.resolve(null),
  ]);
  return {
    content,
    images,
    watches,
    journal: journal
      ? {
          ...journal,
          image: (await resolveImages(journal.id, "ARTICLE", journal.content, preview)).cover,
        }
      : null,
  };
}
