import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseUpdateWithoutShipmentInputObjectSchema as WorkCaseUpdateWithoutShipmentInputObjectSchema } from './WorkCaseUpdateWithoutShipmentInput.schema';
import { WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema as WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutShipmentInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateWithWhereUniqueWithoutShipmentInput>;
export const WorkCaseUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
