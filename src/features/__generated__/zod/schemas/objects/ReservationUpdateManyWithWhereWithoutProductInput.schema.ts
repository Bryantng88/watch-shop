import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationScalarWhereInputObjectSchema as ReservationScalarWhereInputObjectSchema } from './ReservationScalarWhereInput.schema';
import { ReservationUpdateManyMutationInputObjectSchema as ReservationUpdateManyMutationInputObjectSchema } from './ReservationUpdateManyMutationInput.schema';
import { ReservationUncheckedUpdateManyWithoutProductInputObjectSchema as ReservationUncheckedUpdateManyWithoutProductInputObjectSchema } from './ReservationUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ReservationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ReservationUpdateManyMutationInputObjectSchema), z.lazy(() => ReservationUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ReservationUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationUpdateManyWithWhereWithoutProductInput>;
export const ReservationUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
