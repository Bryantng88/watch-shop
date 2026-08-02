import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementWhereUniqueInputObjectSchema as StrapInventoryMovementWhereUniqueInputObjectSchema } from './StrapInventoryMovementWhereUniqueInput.schema';
import { StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateWithoutStrapVariantInput.schema';
import { StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema as StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema } from './StrapInventoryMovementUncheckedCreateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapInventoryMovementWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StrapInventoryMovementCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementUncheckedCreateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCreateOrConnectWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateOrConnectWithoutStrapVariantInput>;
export const StrapInventoryMovementCreateOrConnectWithoutStrapVariantInputObjectZodSchema = makeSchema();
