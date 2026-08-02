import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema'

const makeSchema = () => z.object({
  kind: StrapCatalogOptionKindSchema,
  code: z.string()
}).strict();
export const StrapCatalogOptionKindCodeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionKindCodeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionKindCodeCompoundUniqueInput>;
export const StrapCatalogOptionKindCodeCompoundUniqueInputObjectZodSchema = makeSchema();
