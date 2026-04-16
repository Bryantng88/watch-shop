import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { SupplyCatalogCountOutputTypeArgsObjectSchema as SupplyCatalogCountOutputTypeArgsObjectSchema } from './SupplyCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SupplyCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SupplyCatalogIncludeObjectSchema: z.ZodType<Prisma.SupplyCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogInclude>;
export const SupplyCatalogIncludeObjectZodSchema = makeSchema();
