#!/usr/bin/env node

const fs = require('fs');
const createInterface = require('./createInterface');
const createComponentInterface = require('./createComponentInterface');
const { kebabCase, isOptional, pascalCase } = require('./utils');

const typesDir = 'types';

if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir);

// --------------------------------------------
// Payload
// --------------------------------------------

const payloadTsInterface = `export interface Payload<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  };
}
`;

fs.writeFileSync(`${typesDir}/payload.interface.ts`, payloadTsInterface);

// --------------------------------------------
// User
// --------------------------------------------

const userTsInterface = `export interface User {
  id: number;
  attributes: {
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}
`;

fs.writeFileSync(`${typesDir}/user.interface.ts`, userTsInterface);

// --------------------------------------------
// MediaFormat
// --------------------------------------------

var mediaFormatTsInterface = `export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}
`;

fs.writeFileSync(
  `${typesDir}/media-format.interface.ts`,
  mediaFormatTsInterface
);

// --------------------------------------------
// Media
// --------------------------------------------

var mediaTsInterface = `import { MediaFormat } from './media-format.interface';

export interface Media {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: { thumbnail: MediaFormat; medium: MediaFormat; small: MediaFormat; };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
`;

fs.writeFileSync(`${typesDir}/media.interface.ts`, mediaTsInterface);

// --------------------------------------------
// API Types
// --------------------------------------------

var apiFolders;
try {
  apiFolders = fs.readdirSync('./src/api').filter((x) => !x.startsWith('.'));
} catch (e) {
  console.log('No API types found. Skipping...');
}

if (apiFolders)
  for (const apiFolder of apiFolders) {
    const interfaceName = kebabCase(apiFolder);
    const interface = createInterface(
      `./src/api/${apiFolder}/content-types/${apiFolder}/schema.json`,
      interfaceName
    );
    if (interface)
      fs.writeFileSync(`${typesDir}/${interfaceName}.interface.ts`, interface);
  }

// --------------------------------------------
// Components
// --------------------------------------------

var componentCategoryFolders;
try {
  componentCategoryFolders = fs.readdirSync('./src/components');
} catch (e) {
  console.log('No Component types found. Skipping...');
}

if (componentCategoryFolders) {
  const targetFolder = 'types/components';

  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder);

  for (const componentCategoryFolder of componentCategoryFolders) {
    var componentSchemas = fs.readdirSync(
      `./src/components/${componentCategoryFolder}`
    );
    for (const componentSchema of componentSchemas) {
      const interfaceName = pascalCase(componentSchema.replace('.json', ''));
      const interface = createComponentInterface(
        `./src/components/${componentCategoryFolder}/${componentSchema}`,
        interfaceName
      );
      if (interface)
        fs.writeFileSync(
          `${targetFolder}/${interfaceName}.interface.ts`,
          interface
        );
    }
  }
}
