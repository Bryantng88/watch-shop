import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUpsertWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUpsertWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUpsertWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTechnicalIssueInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MechanicalPartCatalogCreateOrConnectWithoutTechnicalIssueInputObjectSchema).optional(),
  upsert: z.lazy(() => MechanicalPartCatalogUpsertWithoutTechnicalIssueInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MechanicalPartCatalogUpdateToOneWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]).optional()
}).strict();
export const MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInput>;
export const MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
