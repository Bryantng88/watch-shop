import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogSelectObjectSchema as MechanicalPartCatalogSelectObjectSchema } from './MechanicalPartCatalogSelect.schema';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './MechanicalPartCatalogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MechanicalPartCatalogSelectObjectSchema).optional(),
  include: z.lazy(() => MechanicalPartCatalogIncludeObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogArgsObjectSchema = makeSchema();
export const MechanicalPartCatalogArgsObjectZodSchema = makeSchema();
