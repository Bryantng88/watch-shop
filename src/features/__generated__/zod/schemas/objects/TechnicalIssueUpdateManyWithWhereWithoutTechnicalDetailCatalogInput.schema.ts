import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutTechnicalDetailCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectZodSchema = makeSchema();
