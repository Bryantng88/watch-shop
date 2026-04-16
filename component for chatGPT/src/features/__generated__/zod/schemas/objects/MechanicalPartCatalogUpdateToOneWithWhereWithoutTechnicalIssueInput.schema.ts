import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema';
import { MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput>;
export const MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
