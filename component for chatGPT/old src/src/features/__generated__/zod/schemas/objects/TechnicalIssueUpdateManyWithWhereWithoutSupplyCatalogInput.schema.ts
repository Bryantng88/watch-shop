import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutSupplyCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
