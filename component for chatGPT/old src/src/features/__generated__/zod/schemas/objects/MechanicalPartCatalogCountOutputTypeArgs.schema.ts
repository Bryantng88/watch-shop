import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogCountOutputTypeSelectObjectSchema as MechanicalPartCatalogCountOutputTypeSelectObjectSchema } from './MechanicalPartCatalogCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MechanicalPartCatalogCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogCountOutputTypeArgsObjectSchema = makeSchema();
export const MechanicalPartCatalogCountOutputTypeArgsObjectZodSchema = makeSchema();
