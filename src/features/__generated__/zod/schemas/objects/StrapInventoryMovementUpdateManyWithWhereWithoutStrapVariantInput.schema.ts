import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementScalarWhereInputObjectSchema as StrapInventoryMovementScalarWhereInputObjectSchema } from './StrapInventoryMovementScalarWhereInput.schema';
import { StrapInventoryMovementUpdateManyMutationInputObjectSchema as StrapInventoryMovementUpdateManyMutationInputObjectSchema } from './StrapInventoryMovementUpdateManyMutationInput.schema';
import { StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapInventoryMovementScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => StrapInventoryMovementUpdateManyMutationInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedUpdateManyWithoutStrapVariantInputObjectSchema)])
}).strict();
export const StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInput>;
export const StrapInventoryMovementUpdateManyWithWhereWithoutStrapVariantInputObjectZodSchema = makeSchema();
