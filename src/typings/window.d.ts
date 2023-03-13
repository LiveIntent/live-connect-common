export {};

declare global {
  interface Window {
    [k: string]: unknown // allow accessing arbitrary fields
  }
}
