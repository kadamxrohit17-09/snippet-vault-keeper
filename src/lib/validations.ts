import { z } from 'zod';

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(1, 'Password is required')
});

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Snippet validation schema
export const snippetSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .trim()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  code: z.string()
    .trim()
    .min(1, 'Code is required')
    .max(50000, 'Code exceeds 50KB limit'),
  language: z.enum([
    'javascript', 'typescript', 'python', 'java', 'cpp', 
    'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 
    'kotlin', 'html', 'css', 'scss', 'sql', 'bash', 
    'json', 'yaml', 'xml'
  ]),
  tags: z.array(
    z.string()
      .trim()
      .min(1, 'Tag cannot be empty')
      .max(50, 'Tag must be less than 50 characters')
  ).max(10, 'Maximum 10 tags allowed')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SnippetFormData = z.infer<typeof snippetSchema>;
