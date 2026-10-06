import { z } from "zod";

export const TOKEN_CATEGORIES = ["color", "spacing", "typography", "radius", "shadow"] as const;
export const COMPONENT_CATEGORIES = ["actions", "forms", "layout", "feedback", "overlay"] as const;

const tokenSchema = z.object({ value: z.string(), description: z.string() });

// Category -> (dot-separated token name -> token)
export const tokensFileSchema = z.object(
  Object.fromEntries(TOKEN_CATEGORIES.map((c) => [c, z.record(z.string(), tokenSchema)])) as Record<
    (typeof TOKEN_CATEGORIES)[number],
    z.ZodRecord<z.ZodString, typeof tokenSchema>
  >,
);

const propSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string(),
});

export const componentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum(COMPONENT_CATEGORIES),
  props: z.array(propSchema),
  variants: z.array(z.string()),
  tokensUsed: z.array(z.string()),
  example: z.string(),
  a11y: z.string(),
});

export const componentsFileSchema = z.array(componentSchema);

export type Token = z.infer<typeof tokenSchema>;
export type TokensFile = z.infer<typeof tokensFileSchema>;
export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];
export type Component = z.infer<typeof componentSchema>;
export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];
export type DesignSystemData = { components: Component[]; tokens: TokensFile };
