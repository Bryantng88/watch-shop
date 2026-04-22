import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlCreateManyInputObjectSchema as SystemJobControlCreateManyInputObjectSchema } from './objects/SystemJobControlCreateManyInput.schema';

export const SystemJobControlCreateManyAndReturnSchema: z.ZodType<Prisma.SystemJobControlCreateManyAndReturnArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(), data: z.union([ SystemJobControlCreateManyInputObjectSchema, z.array(SystemJobControlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlCreateManyAndReturnArgs>;

export const SystemJobControlCreateManyAndReturnZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(), data: z.union([ SystemJobControlCreateManyInputObjectSchema, z.array(SystemJobControlCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();