// @flow
import React, { PureComponent } from "react";
import { navigate } from "@reach/router";
import parse from "html-react-parser";
import ShortCodeHighLight from "./ShortCodeHighLight";
import ShortCodeCompareImage from "./ShortCodeCompareImage";
import ShortCodeGallery from "./ShortCodeGallery";
import Image from "../Image/Image";

type Props = {
  children: string,
  isTitle?: boolean,
  isTitleSmall?: boolean
};

class HtmlViewer extends PureComponent<Props> {
  _addToQueue = null;

  $container: ?HTMLElement;

  _getHost = (): string => {
    const { origin }: { origin: string } = window.location;
    return origin;
  };

  _checkUrl = (href: string): boolean => {
    return (
      // eslint-disable-next-line no-useless-escape
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
        href
      )
    );
  };

  _handleLoopLinks = ($link: HTMLElement): void => {
    $link.addEventListener("click", this._handleLinkNavigate);
  };

  _handleLinkNavigate = (event: any): void => {
    const href: string = event.currentTarget.getAttribute("href");
    const host: string = this._getHost();
    if (href.includes(host) || href.includes("https://highspeedblog.com")) {
      event.preventDefault();
      href.includes(host) &&
        navigate(`/${href.replace(new RegExp(`^.*${host}(\\/|$)`, "g"), "")}`);
      href.includes("https://highspeedblog.com") &&
        navigate(
          `/${href.replace(
            new RegExp(`^.*${"https://highspeedblog.com"}(\\/|$)`, "g"),
            ""
          )}`
        );
      return;
    }
    if (!this._checkUrl(href)) {
      event.preventDefault();
      navigate(`/${href.replace(/^\//g, "")}`);
    }
  };

  _setContainerRef = (c: any): void => {
    this.$container = c;
    if (this.$container) {
      const $links: Array<HTMLElement> = [
        ...this.$container.querySelectorAll("a")
      ];
      $links.forEach(this._handleLoopLinks);
    }
  };

  _checkChildren = (data: any): any => {
    if (typeof data === "string") {
      const c: Function = (soucer: string): string => {
        const b: Array<string> | null = soucer.match(/input.*value=""/g);
        return !!b
          ? b.reduce((str: string, item: string): string => {
              const d: string = item.replace(/value=""/g, "");
              return str.replace(item, d);
            }, soucer)
          : soucer;
      };

      return c(data).replace(/allowTransparency="true"/g, "");
    }
    return JSON.stringify(data);
  };

  _getOptions = (): Object => {
    return {
      replace: ({ attribs, name, children }: Object): React$Node => {
        if (!attribs) return null;

        if (name === "img") {
          const { src, alt }: Object = attribs;
          return <Image useDefaultImage src={src} zoomSrc={src} alt={alt} />;
        }

        switch (attribs.class) {
          case "react-code-highlight":
            return <ShortCodeHighLight attribs={attribs} children={children} />;
          case "react-compare-image":
            return <ShortCodeCompareImage attribs={attribs} />;
          case "react-gallery":
            return <ShortCodeGallery attribs={attribs} />;
          default:
            return null;
        }
      }
    };
  };

  render(): React$Node {
    const { children, isTitle, isTitleSmall, ...props }: Props = this.props;
    const STYLE: Object = isTitle
      ? {
          lineHeight: "27px",
          maxHeight: 54,
          textOverflow: "ellipsis",
          wordWrap: "break-word",
          overflow: "hidden"
        }
      : {};
    const STYLE2: Object = isTitleSmall
      ? {
          maxHeight: "2.75em",
          lineHeight: "1.375em",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
          overflow: "hidden"
        }
      : {};

    return (
      <div
        {...props}
        ref={this._setContainerRef}
        style={{ ...STYLE, ...STYLE2 }}
        // eslint-disable-next-line react/no-danger
        // dangerouslySetInnerHTML={{ __html: children }}
      >
        {parse(this._checkChildren(children), this._getOptions())}
      </div>
    );
  }
}

export default HtmlViewer;
