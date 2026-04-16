import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInput>;
export const MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
