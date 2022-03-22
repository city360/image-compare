// @flow
import React, { PureComponent } from "react";
import "./prism";
import "./prism.css";

type Props = {
  // eslint-disable-next-line flowtype/space-after-type-colon
  language:
    | "css"
    | "scss"
    | "js"
    | "jsx"
    | "tsx"
    | "php"
    | "go"
    | "java"
    | "python"
    | "typescript"
    | "c"
    | "cpp",
  children: string
};

export default class CodeHighLight extends PureComponent<Props> {
  static defaultProps = {
    language: "js"
  };

  _code: ?HTMLElement;

  componentDidMount(): void {
    this._highlight();
  }

  componentDidUpdate(prevProps: Props): void {
    const { children }: Props = this.props;
    if (prevProps.children !== children) {
      this._highlight();
    }
  }

  _highlight = (): void => {
    if (this._code) {
      window.Prism.highlightElement(this._code);
    }
  };

  _setCodeRef = (c: ?HTMLElement): void => {
    this._code = c;
  };

  render(): React$Node {
    const { children, language }: Props = this.props;
    return (
      <pre>
        <code ref={this._setCodeRef} className={`language-${language}`}>
          {children.trim()}
        </code>
      </pre>
    );
  }
}
