import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueScalarWhereInputObjectSchema as TechnicalIssueScalarWhereInputObjectSchema } from './TechnicalIssueScalarWhereInput.schema';
import { TechnicalIssueUpdateManyMutationInputObjectSchema as TechnicalIssueUpdateManyMutationInputObjectSchema } from './TechnicalIssueUpdateManyMutationInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalIssueScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalIssueUpdateManyMutationInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutMechanicalPartCatalogInputObjectSchema)])
}).strict();
export const TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInput>;
export const TechnicalIssueUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectZodSchema = makeSchema();
