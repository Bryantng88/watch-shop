import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]),
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]),
  where: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogUpsertWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpsertWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpsertWithoutTaskActionInput>;
export const MechanicalPartCatalogUpsertWithoutTaskActionInputObjectZodSchema = makeSchema();
