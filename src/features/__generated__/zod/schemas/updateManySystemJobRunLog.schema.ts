import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogUpdateManyMutationInputObjectSchema as SystemJobRunLogUpdateManyMutationInputObjectSchema } from './objects/SystemJobRunLogUpdateManyMutationInput.schema';
import { SystemJobRunLogWhereInputObjectSchema as SystemJobRunLogWhereInputObjectSchema } from './objects/SystemJobRunLogWhereInput.schema';

export const SystemJobRunLogUpdateManySchema: z.ZodType<Prisma.SystemJobRunLogUpdateManyArgs> = z.object({ data: SystemJobRunLogUpdateManyMutationInputObjectSchema, where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogUpdateManyArgs>;

export const SystemJobRunLogUpdateManyZodSchema = z.object({ data: SystemJobRunLogUpdateManyMutationInputObjectSchema, where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict();