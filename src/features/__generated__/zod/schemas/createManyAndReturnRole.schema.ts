import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { RoleSelectObjectSchema as RoleSelectObjectSchema } from './objects/RoleSelect.schema';
import { RoleCreateManyInputObjectSchema as RoleCreateManyInputObjectSchema } from './objects/RoleCreateManyInput.schema';

export const RoleCreateManyAndReturnSchema: z.ZodType<Prisma.RoleCreateManyAndReturnArgs> = z.object({ select: RoleSelectObjectSchema.optional(), data: z.union([ RoleCreateManyInputObjectSchema, z.array(RoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.RoleCreateManyAndReturnArgs>;

export const RoleCreateManyAndReturnZodSchema = z.object({ select: RoleSelectObjectSchema.optional(), data: z.union([ RoleCreateManyInputObjectSchema, z.array(RoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();