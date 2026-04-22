import { readFileSync } from "fs";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import yaml from "js-yaml";

const contentBlockSchema = z.object({ _component: z.string() }).passthrough();

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  image: z.string().optional(),
  canonical: z.string().optional(),
  pageSections: z.array(contentBlockSchema),
});

const docsPageSchema = z.object({
  title: z.string(),
  contentSections: z.array(contentBlockSchema),
});

const docsComponentSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  order: z.number().optional(),
  overview: z.string().optional(),
  spacing: z.string().optional().nullable(),
  component: z.string().optional(),
  component_path: z.string().optional(),
  blocks: z
    .union([z.record(z.string(), z.any()), z.array(z.record(z.string(), z.any()))])
    .optional(),
  slots: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        fallback_for: z.string().optional().nullable(),
        child_component: z
          .object({
            name: z.string(),
            props: z.array(z.string()).optional(),
          })
          .optional()
          .nullable(),
      })
    )
    .optional(),
  examples: z
    .union([
      z.array(
        z.object({
          title: z.string().optional(),
          slugs: z.array(z.string()),
        })
      ),
      z.null(),
    ])
    .optional()
    .transform((val) => {
      if (!val) return [];

      return val.map((example) => ({
        title:
          example.title ||
          (example.slugs?.[0]
            ? example.slugs[0].replace(/-/g, " ").charAt(0).toUpperCase() +
              example.slugs[0].replace(/-/g, " ").slice(1)
            : "Example"),
        slugs: example.slugs,
        size: example.size ?? "md",
      }));
    }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: pageSchema,
});

const docsPagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/component-docs/content/pages" }),
  schema: docsPageSchema,
});

const docsComponentsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/component-docs/content/components" }),
  schema: docsComponentSchema,
});

const blogPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  author: z.string().default("Anonymous"),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: blogPostSchema,
});

// Dynamic generic collections from collections.yaml
interface CollectionField {
  key: string;
  type: string;
  required?: boolean;
}

interface CollectionDef {
  name: string;
  slug: string;
  enabled: boolean;
  singular_label: string;
  has_archive: boolean;
  archive_url?: string;
  fields: CollectionField[];
}

interface CollectionsConfig {
  collections: CollectionDef[];
}

const fieldTypeToZod: Record<string, z.ZodTypeAny> = {
  text: z.string(),
  textarea: z.string(),
  image: z.string(),
  checkbox: z.boolean(),
  date: z.coerce.date(),
  number: z.number(),
};

function buildCollectionSchema(fields: CollectionField[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const baseType = fieldTypeToZod[field.type] || z.string();
    shape[field.key] = field.required ? baseType : baseType.optional();
  }

  return z.object(shape);
}

function loadGenericCollections(): Record<string, ReturnType<typeof defineCollection>> {
  const result: Record<string, ReturnType<typeof defineCollection>> = {};

  try {
    const raw = readFileSync("./src/data/collections.yaml", "utf-8");
    const config = yaml.load(raw) as CollectionsConfig;

    if (!config?.collections?.length) return result;

    for (const col of config.collections) {
      if (!col.enabled) continue;

      result[col.slug] = defineCollection({
        loader: glob({ pattern: "**/*.md", base: `./src/content/collections/${col.slug}` }),
        schema: buildCollectionSchema(col.fields || []),
      });
    }
  } catch {
    // collections.yaml doesn't exist or is empty — no generic collections
  }

  return result;
}

const genericCollections = loadGenericCollections();

export const collections = {
  pages: pagesCollection,
  "docs-pages": docsPagesCollection,
  "docs-components": docsComponentsCollection,
  blog: blogCollection,
  ...genericCollections,
};
