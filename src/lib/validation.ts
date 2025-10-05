import { z } from "zod";

// CPF validation regex (accepts formats: 123.456.789-01 or 12345678901)
const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

// Brazilian phone validation (10-11 digits)
const phoneRegex = /^(\d{10,11})$/;

// Client data validation schema
export const clienteSchema = z.object({
  nome: z.string()
    .trim()
    .min(1, { message: "Nome é obrigatório" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" })
    .optional()
    .or(z.literal("")),
  telefone: z.string()
    .trim()
    .regex(phoneRegex, { message: "Telefone deve ter 10-11 dígitos" })
    .optional()
    .or(z.literal("")),
  whatsapp: z.string()
    .trim()
    .regex(phoneRegex, { message: "WhatsApp deve ter 10-11 dígitos" })
    .optional()
    .or(z.literal("")),
  cpf: z.string()
    .trim()
    .regex(cpfRegex, { message: "CPF inválido. Use formato: 123.456.789-01 ou 12345678901" })
    .optional()
    .or(z.literal("")),
  endereco: z.string()
    .trim()
    .max(500, { message: "Endereço deve ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
  data_nascimento: z.string().optional().or(z.literal("")),
  notas: z.string()
    .trim()
    .max(1000, { message: "Notas deve ter no máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
});

// Agendamento validation schema
export const agendamentoSchema = z.object({
  servico: z.string()
    .trim()
    .max(200, { message: "Serviço deve ter no máximo 200 caracteres" })
    .optional()
    .or(z.literal("")),
  valor: z.number()
    .min(0, { message: "Valor não pode ser negativo" })
    .optional(),
  data: z.string().min(1, { message: "Data é obrigatória" }),
  hora: z.string().min(1, { message: "Hora é obrigatória" }),
  cliente_id: z.string().uuid({ message: "Cliente inválido" }),
});

// Input sanitization for WhatsApp messages
export function sanitizeForWhatsApp(text: string): string {
  // Remove potentially dangerous characters but keep emojis and special chars for formatting
  // Remove control characters, null bytes, etc.
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .trim()
    .slice(0, 4096); // WhatsApp message limit
}

// Sanitize client name for display
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 100);
}

// Format and validate Brazilian phone number
export function formatBrazilianPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Remove country code if present
  const withoutCountryCode = cleaned.startsWith("55") ? cleaned.substring(2) : cleaned;
  
  // Validate length (10-11 digits for Brazilian numbers)
  if (withoutCountryCode.length < 10 || withoutCountryCode.length > 11) {
    throw new Error("Número de telefone inválido");
  }
  
  return withoutCountryCode;
}

// Validate CPF format
export function validateCPF(cpf: string): boolean {
  if (!cpf) return true; // Optional field
  
  const cleaned = cpf.replace(/\D/g, "");
  
  // Check if has 11 digits
  if (cleaned.length !== 11) return false;
  
  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
}
