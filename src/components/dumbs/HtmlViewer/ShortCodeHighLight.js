// @flow
import React, { memo } from "react";
import parse, { domToReact } from "html-react-parser";
import { renderToStaticMarkup } from "react-dom/server";
import CodeHighLight from "../CodeHighLight/CodeHighLight";

type Props = {
  attribs: Object,
  children: Array<any>
};

function ShortCodeHighLight({ attribs, children }: Props): React$Node {
  const value: string = renderToStaticMarkup(domToReact(children));
  const language: string = attribs["data-language"] || "";
  return <CodeHighLight language={language}>{parse(value)}</CodeHighLight>;
}

export default memo<Props>(ShortCodeHighLight);
