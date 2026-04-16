import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutServiceCatalogInputObjectZodSchema = makeSchema();
