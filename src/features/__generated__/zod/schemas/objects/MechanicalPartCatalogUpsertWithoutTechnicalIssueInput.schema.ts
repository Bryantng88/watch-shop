import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]),
  where: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogUpsertWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpsertWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpsertWithoutTechnicalIssueInput>;
export const MechanicalPartCatalogUpsertWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
