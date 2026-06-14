import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogCreateNestedOneWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateNestedOneWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateNestedOneWithoutTaskActionInput>;
export const MechanicalPartCatalogCreateNestedOneWithoutTaskActionInputObjectZodSchema = makeSchema();
