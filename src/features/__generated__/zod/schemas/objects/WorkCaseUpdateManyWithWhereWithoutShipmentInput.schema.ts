import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScalarWhereInputObjectSchema as WorkCaseScalarWhereInputObjectSchema } from './WorkCaseScalarWhereInput.schema';
import { WorkCaseUpdateManyMutationInputObjectSchema as WorkCaseUpdateManyMutationInputObjectSchema } from './WorkCaseUpdateManyMutationInput.schema';
import { WorkCaseUncheckedUpdateManyWithoutShipmentInputObjectSchema as WorkCaseUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateManyMutationInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateManyWithWhereWithoutShipmentInput>;
export const WorkCaseUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
