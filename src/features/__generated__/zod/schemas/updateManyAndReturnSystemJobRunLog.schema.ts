import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogUpdateManyMutationInputObjectSchema as SystemJobRunLogUpdateManyMutationInputObjectSchema } from './objects/SystemJobRunLogUpdateManyMutationInput.schema';
import { SystemJobRunLogWhereInputObjectSchema as SystemJobRunLogWhereInputObjectSchema } from './objects/SystemJobRunLogWhereInput.schema';

export const SystemJobRunLogUpdateManyAndReturnSchema: z.ZodType<Prisma.SystemJobRunLogUpdateManyAndReturnArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(), data: SystemJobRunLogUpdateManyMutationInputObjectSchema, where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogUpdateManyAndReturnArgs>;

export const SystemJobRunLogUpdateManyAndReturnZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(), data: SystemJobRunLogUpdateManyMutationInputObjectSchema, where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict();