import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlCreateManyInputObjectSchema as SystemJobControlCreateManyInputObjectSchema } from './objects/SystemJobControlCreateManyInput.schema';

export const SystemJobControlCreateManySchema: z.ZodType<Prisma.SystemJobControlCreateManyArgs> = z.object({ data: z.union([ SystemJobControlCreateManyInputObjectSchema, z.array(SystemJobControlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlCreateManyArgs>;

export const SystemJobControlCreateManyZodSchema = z.object({ data: z.union([ SystemJobControlCreateManyInputObjectSchema, z.array(SystemJobControlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();