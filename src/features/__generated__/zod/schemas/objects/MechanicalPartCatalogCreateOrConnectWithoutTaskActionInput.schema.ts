import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateOrConnectWithoutTaskActionInput>;
export const MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
