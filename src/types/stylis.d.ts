declare module "stylis" {
  export const prefixer: any;
  export function serialize(elements: any[], callback: any): string;
  export function compile(css: string): any[];
  export function middleware(collection: any[]): any;
}
