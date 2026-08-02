import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema'

const makeSchema = () => z.object({
  set: StrapCatalogOptionKindSchema.optional()
}).strict();
export const EnumStrapCatalogOptionKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStrapCatalogOptionKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapCatalogOptionKindFieldUpdateOperationsInput>;
export const EnumStrapCatalogOptionKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();
