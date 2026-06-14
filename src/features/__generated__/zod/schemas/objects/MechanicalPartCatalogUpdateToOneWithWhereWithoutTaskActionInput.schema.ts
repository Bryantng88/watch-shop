import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema';
import { MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)])
}).strict();
export const MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInput>;
export const MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectZodSchema = makeSchema();
