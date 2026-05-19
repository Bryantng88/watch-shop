import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentScalarWhereInputObjectSchema as ShipmentScalarWhereInputObjectSchema } from './ShipmentScalarWhereInput.schema';
import { ShipmentUpdateManyMutationInputObjectSchema as ShipmentUpdateManyMutationInputObjectSchema } from './ShipmentUpdateManyMutationInput.schema';
import { ShipmentUncheckedUpdateManyWithoutOrderInputObjectSchema as ShipmentUncheckedUpdateManyWithoutOrderInputObjectSchema } from './ShipmentUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ShipmentUpdateManyMutationInputObjectSchema), z.lazy(() => ShipmentUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const ShipmentUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.ShipmentUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentUpdateManyWithWhereWithoutOrderInput>;
export const ShipmentUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
