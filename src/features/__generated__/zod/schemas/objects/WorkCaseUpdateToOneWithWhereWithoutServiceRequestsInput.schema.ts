import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { WorkCaseUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUpdateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutServiceRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkCaseUpdateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema)])
}).strict();
export const WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInputObjectSchema: z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInput>;
export const WorkCaseUpdateToOneWithWhereWithoutServiceRequestsInputObjectZodSchema = makeSchema();
