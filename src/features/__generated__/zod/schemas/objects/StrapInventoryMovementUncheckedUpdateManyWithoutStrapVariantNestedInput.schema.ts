import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateOrConnectWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInput.schema';
import { StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema as StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema } from './StrapInventoryMovementCreateManyStrapVariantInputEnvelope.schema';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './StrapInventoryMovementWhereUniqueInput.schema';
import { StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInput.schema';
import { StrapInventoryMovementScalarWhereInputObjectSchema as StrapInventoryMovementScalarWhereInputObjectSchema } from './StrapInventoryMovementScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema).array(), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => StrapInventoryMovementScalarWhereInputObjectSchema), z.lazy(() => StrapInventoryMovementScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantNestedInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantNestedInput>;
export const StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantNestedInputObjectZodSchema = makeSchema();
