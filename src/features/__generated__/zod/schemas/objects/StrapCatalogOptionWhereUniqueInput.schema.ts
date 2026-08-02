import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindCodeCompoundUniqueInputObjectSchema as StrapCatalogOptionKindCodeCompoundUniqueInputObjectSchema } from './StrapCatalogOptionKindCodeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  kind_code: z.lazy(() => StrapCatalogOptionKindCodeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const StrapCatalogOptionWhereUniqueInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionWhereUniqueInput>;
export const StrapCatalogOptionWhereUniqueInputObjectZodSchema = makeSchema();
