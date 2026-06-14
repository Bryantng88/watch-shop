import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedCreateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema as MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogCreateOrConnectWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUpsertWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUpsertWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUpsertWithoutTaskActionInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './MechanicalPartCatalogWhereInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUpdateWithoutTaskActionInput.schema';
import { MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema as MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema } from './MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MechanicalPartCatalogCreateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MechanicalPartCatalogCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  upsert: z.lazy(() => MechanicalPartCatalogUpsertWithoutTaskActionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => MechanicalPartCatalogWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => MechanicalPartCatalogUpdateToOneWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => MechanicalPartCatalogUncheckedUpdateWithoutTaskActionInputObjectSchema)]).optional()
}).strict();
export const MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInput>;
export const MechanicalPartCatalogUpdateOneWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
