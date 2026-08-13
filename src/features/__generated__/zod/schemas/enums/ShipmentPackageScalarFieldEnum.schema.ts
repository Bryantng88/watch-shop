import * as z from 'zod';

export const ShipmentPackageScalarFieldEnumSchema = z.enum(['id', 'shipmentId', 'weightGram', 'lengthCm', 'widthCm', 'heightCm', 'itemCount', 'declaredValue', 'contentDescription', 'createdAt', 'updatedAt'])

export type ShipmentPackageScalarFieldEnum = z.infer<typeof ShipmentPackageScalarFieldEnumSchema>;