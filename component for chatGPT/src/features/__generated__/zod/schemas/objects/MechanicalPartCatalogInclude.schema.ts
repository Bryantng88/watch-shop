import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { MechanicalPartCatalogCountOutputTypeArgsObjectSchema as MechanicalPartCatalogCountOutputTypeArgsObjectSchema } from './MechanicalPartCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MechanicalPartCatalogIncludeObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogInclude>;
export const MechanicalPartCatalogIncludeObjectZodSchema = makeSchema();
