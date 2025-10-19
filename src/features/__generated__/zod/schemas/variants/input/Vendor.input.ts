import * as z from 'zod';

import { VendorRoleSchema } from '../../enums/VendorRole.schema';
// prettier-ignore
export const VendorInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: VendorRoleSchema,
    isAuthorized: z.boolean(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    acquisitions: z.array(z.unknown()),
    Invoice: z.array(z.unknown()),
    services: z.array(z.unknown()),
    Product: z.array(z.unknown())
}).strict();

export type VendorInputType = z.infer<typeof VendorInputSchema>;
