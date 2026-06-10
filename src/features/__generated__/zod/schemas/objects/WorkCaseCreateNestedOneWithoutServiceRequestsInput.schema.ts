import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateWithoutServiceRequestsInputObjectSchema as WorkCaseCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateWithoutServiceRequestsInput.schema';
import { WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema as WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema } from './WorkCaseUncheckedCreateWithoutServiceRequestsInput.schema';
import { WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema as WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema } from './WorkCaseCreateOrConnectWithoutServiceRequestsInput.schema';
import { WorkCaseWhereUniqueInputObjectSchema as WorkCaseWhereUniqueInputObjectSchema } from './WorkCaseWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkCaseCreateWithoutServiceRequestsInputObjectSchema), z.lazy(() => WorkCaseUncheckedCreateWithoutServiceRequestsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkCaseCreateOrConnectWithoutServiceRequestsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkCaseWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkCaseCreateNestedOneWithoutServiceRequestsInputObjectSchema: z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutServiceRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateNestedOneWithoutServiceRequestsInput>;
export const WorkCaseCreateNestedOneWithoutServiceRequestsInputObjectZodSchema = makeSchema();
