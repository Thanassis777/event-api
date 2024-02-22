export const replacePlaceholderWithHTML = (template: String, replacements: Record<string, string>) => {
  for (const [placeholder, value] of Object.entries(replacements)) 
    template = template.replace(`[${placeholder}]`, value);
  return template;
};