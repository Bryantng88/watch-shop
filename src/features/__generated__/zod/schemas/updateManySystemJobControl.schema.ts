import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlUpdateManyMutationInputObjectSchema as SystemJobControlUpdateManyMutationInputObjectSchema } from './objects/SystemJobControlUpdateManyMutationInput.schema';
import { SystemJobControlWhereInputObjectSchema as SystemJobControlWhereInputObjectSchema } from './objects/SystemJobControlWhereInput.schema';

export const SystemJobControlUpdateManySchema: z.ZodType<Prisma.SystemJobControlUpdateManyArgs> = z.object({ data: SystemJobControlUpdateManyMutationInputObjectSchema, where: SystemJobControlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlUpdateManyArgs>;

export const SystemJobControlUpdateManyZodSchema = z.object({ data: SystemJobControlUpdateManyMutationInputObjectSchema, where: SystemJobControlWhereInputObjectSchema.optional() }).strict();