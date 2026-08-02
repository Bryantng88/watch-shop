import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './StrapInventoryMovementWhereUniqueInput.schema';
import { StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUpdateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedCreateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInput>;
export const StrapInventoryMovementUpsertWithWhereUniqueWithoutStrapVariantInputObjectZodSchema = makeSchema();
