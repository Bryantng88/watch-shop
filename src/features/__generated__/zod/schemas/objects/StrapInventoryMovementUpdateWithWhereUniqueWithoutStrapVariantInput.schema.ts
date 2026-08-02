import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './StrapInventoryMovementWhereUniqueInput.schema';
import { StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUpdateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => StrapInventoryMovementUpdateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedUpdateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInput>;
export const StrapInventoryMovementUpdateWithWhereUniqueWithoutStrapVariantInputObjectZodSchema = makeSchema();
