import * as z from 'zod';

import { VendorRoleSchema } from '../../enums/VendorRole.schema';
// prettier-ignore
export const VendorModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: VendorRoleSchema,
    isAuthorized: z.boolean(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bankName: z.string().nullable(),
    bankAcc: z.string().nullable(),
    acquisitions: z.array(z.unknown()),
    invoice: z.array(z.unknown()),
    services: z.array(z.unknown()),
    Product: z.array(z.unknown()),
    Bank: z.unknown().nullable()
}).strict();

export type VendorPureType = z.infer<typeof VendorModelSchema>;
