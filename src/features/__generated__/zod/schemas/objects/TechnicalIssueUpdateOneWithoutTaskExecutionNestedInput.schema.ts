import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedCreateWithoutTaskExecutionInput.schema';
import { TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema as TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueCreateOrConnectWithoutTaskExecutionInput.schema';
import { TechnicalIssueUpsertWithoutTaskExecutionInputObjectSchema as TechnicalIssueUpsertWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUpsertWithoutTaskExecutionInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema as TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInput.schema';
import { TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUpdateWithoutTaskExecutionInput.schema';
import { TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema as TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema } from './TechnicalIssueUncheckedUpdateWithoutTaskExecutionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalIssueCreateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedCreateWithoutTaskExecutionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalIssueCreateOrConnectWithoutTaskExecutionInputObjectSchema).optional(),
  upsert: z.lazy(() => TechnicalIssueUpsertWithoutTaskExecutionInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TechnicalIssueWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TechnicalIssueWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TechnicalIssueUpdateToOneWithWhereWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUpdateWithoutTaskExecutionInputObjectSchema), z.lazy(() => TechnicalIssueUncheckedUpdateWithoutTaskExecutionInputObjectSchema)]).optional()
}).strict();
export const TechnicalIssueUpdateOneWithoutTaskExecutionNestedInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutTaskExecutionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateOneWithoutTaskExecutionNestedInput>;
export const TechnicalIssueUpdateOneWithoutTaskExecutionNestedInputObjectZodSchema = makeSchema();
