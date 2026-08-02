import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateOrConnectWithoutStrapVariantInput.schema';
import { StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema as StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema } from './StrapInventoryMovementCreateManyStrapVariantInputEnvelope.schema';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './StrapInventoryMovementWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema).array(), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema), z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const StrapInventoryMovementUncheckedCreateNestedManyWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUncheckedCreateNestedManyWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUncheckedCreateNestedManyWithoutStrapVariantInput>;
export const StrapInventoryMovementUncheckedCreateNestedManyWithoutStrapVariantInputObjectZodSchema = makeSchema();
