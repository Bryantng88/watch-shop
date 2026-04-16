import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  connect: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInput>;
export const MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
