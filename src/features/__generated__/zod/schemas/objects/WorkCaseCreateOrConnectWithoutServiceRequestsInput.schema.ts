import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema';
import { WorkCaseCreateWithoutServiceRequestsInputObjectSchema as WorkCaseCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedCreateWithoutServiceRequestsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkCaseCreateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema)])
}).strict();
export const WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutServiceRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateOrConnectWithoutServiceRequestsInput>;
export const WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectZodSchema = makeSchema();
