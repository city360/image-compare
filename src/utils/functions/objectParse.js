// @flow
function replaceCallback(key: string): string {
  return `"${key.trim()}"`;
}

function objectParse(source: string): Object {
  return JSON.parse(source.replace(/\w+\s*(?=:)/g, replaceCallback));
}

export default objectParse;
