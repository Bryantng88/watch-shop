import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUpdateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedUpdateWithoutServiceRequestsInput.schema';
import { WorkCaseCreateWithoutServiceRequestsInputObjectSchema as WorkCaseCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedCreateWithoutServiceRequestsInput.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkCaseUpdateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedUpdateWithoutServiceRequestsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema)]),
  where: z.lazy(() => WorkCaseWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseUpsertWithoutServiceRequestsInputObjectSchema: z.ZodType<Prisma.WorkCaseUpsertWithoutServiceRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseUpsertWithoutServiceRequestsInput>;
export const WorkCaseUpsertWithoutServiceRequestsInputObjectZodSchema = makeSchema();
