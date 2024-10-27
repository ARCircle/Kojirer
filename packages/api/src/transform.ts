import openapiTS from 'openapi-typescript';
import ts from 'typescript';
import fs from "node:fs";
import addNullTransformer from './addNullFormatter';

const schema = new URL("../openapi.yml", import.meta.url);
const printer = ts.createPrinter();

const BLOB = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier("Blob")
);
const DATE = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier("Date")
);
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

openapiTS(schema, {
  transform(schemaObject, metadata) {
    if (schemaObject.format === 'binary') {
      return schemaObject.nullable 
        ? ts.factory.createUnionTypeNode([BLOB, NULL])
        : BLOB;
    }

    if (schemaObject.format === "date-time") {
      return schemaObject.nullable
        ? ts.factory.createUnionTypeNode([DATE, NULL])
        : DATE;
    }
  }
})
.then(ast => {
  const result = ts.transform(ast, [addNullTransformer]);

  const transformedCode = result.transformed
  // @ts-ignore
  .map(node => printer.printNode(ts.EmitHint.Unspecified, node, undefined))
  .join('\n');

  return transformedCode;
})
.then(contents => {
  fs.mkdirSync(new URL("./gen", import.meta.url))
  fs.writeFileSync(new URL("./gen/schema.ts", import.meta.url), contents, { flag: "wx" });
});
