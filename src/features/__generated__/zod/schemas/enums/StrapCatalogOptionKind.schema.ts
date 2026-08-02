import * as z from 'zod';

export const StrapCatalogOptionKindSchema = z.enum(['COLOR', 'MATERIAL', 'CLASP_TYPE', 'FINISH', 'LENGTH_CLASS', 'STORAGE_LOCATION'])

export type StrapCatalogOptionKind = z.infer<typeof StrapCatalogOptionKindSchema>;