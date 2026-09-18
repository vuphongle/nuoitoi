import { z } from 'zod';

export const LIXI_SESSION_MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const LIXI_SESSION_ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

const imageFileSchema = z
  .instanceof(File, { message: 'Vui lòng chọn một file ảnh' })
  .refine(
    (file) => LIXI_SESSION_ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Ảnh phải là định dạng jpg, png, webp hoặc gif'
  )
  .refine((file) => file.size <= LIXI_SESSION_MAX_IMAGE_SIZE, 'Ảnh không được vượt quá 5MB');

const lixiSessionBaseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập mã code')
    .max(50, 'Code tối đa 50 ký tự')
    .regex(/^[A-Za-z0-9_-]+$/, 'Code chỉ được chứa chữ, số, - hoặc _'),
  name: z.string().trim().min(1, 'Vui lòng nhập tên').max(255, 'Tên tối đa 255 ký tự'),
  tagline: z.string().trim().min(1, 'Vui lòng nhập tagline').max(255, 'Tagline tối đa 255 ký tự'),
  bank: z.string().trim().min(1, 'Vui lòng nhập ngân hàng').max(100, 'Tên ngân hàng tối đa 100 ký tự'),
  account: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số tài khoản')
    .max(50, 'Số tài khoản tối đa 50 ký tự')
    .regex(/^[0-9]+$/, 'Số tài khoản chỉ được chứa chữ số'),
  owner: z.string().trim().min(1, 'Vui lòng nhập chủ tài khoản').max(255, 'Tối đa 255 ký tự'),
  content: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập nội dung chuyển khoản')
    .max(255, 'Nội dung tối đa 255 ký tự'),
  sort_order: z.number().int('Thứ tự phải là số nguyên').min(0, 'Thứ tự phải >= 0'),
});

export function buildLixiSessionSchema(isEdit: boolean) {
  return lixiSessionBaseSchema.extend({
    qr: isEdit ? imageFileSchema.nullable().optional() : imageFileSchema,
    avatar: isEdit ? imageFileSchema.nullable().optional() : imageFileSchema,
  });
}

export type LixiSessionFormSchemaValues = z.infer<ReturnType<typeof buildLixiSessionSchema>>;
