declare module 'class-variance-authority' {
  type VariantProps<T> = {
    [K in keyof T]: T[K];
  };

  type ClassValue = string | number | boolean | null | undefined | ClassValue[];

  function cva(initialStyles: string, config?: {
    variants?: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, string>;
  }): (props: Record<string, any>) => string;

  export { cva, VariantProps, ClassValue };
}
