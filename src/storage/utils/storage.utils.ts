import * as fs from 'fs';

export const createDirIfNotExist = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  return path;
};
