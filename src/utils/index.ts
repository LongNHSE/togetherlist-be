export const getNameImageFromUrl = (url: string): string => {
  return url.split('/')[3];
}