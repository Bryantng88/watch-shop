import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { RoleSelectObjectSchema as RoleSelectObjectSchema } from './objects/RoleSelect.schema';
import { RoleUpdateManyMutationInputObjectSchema as RoleUpdateManyMutationInputObjectSchema } from './objects/RoleUpdateManyMutationInput.schema';
import { RoleWhereInputObjectSchema as RoleWhereInputObjectSchema } from './objects/RoleWhereInput.schema';

export const RoleUpdateManyAndReturnSchema: z.ZodType<Prisma.RoleUpdateManyAndReturnArgs> = z.object({ select: RoleSelectObjectSchema.optional(), data: RoleUpdateManyMutationInputObjectSchema, where: RoleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.RoleUpdateManyAndReturnArgs>;

export const RoleUpdateManyAndReturnZodSchema = z.object({ select: RoleSelectObjectSchema.optional(), data: RoleUpdateManyMutationInputObjectSchema, where: RoleWhereInputObjectSchema.optional() }).strict();