// @flow
import React, { PureComponent } from "react";
import { render } from "react-dom";
import Helmet from "react-helmet";
import { offset, sleep } from "../../../utils/functions";

type Props = {
  alt: string,
  src: any,
  preview: string,
  ratio: string,
  containerClassName: string,
  containerStyle: Object,
  useDefaultImage: boolean,
  useParallax: boolean,
  useLazyLoading: boolean,
  parallaxSpeed: number,
  animationDisabled: boolean,
  scrollTarget: string,
  resizeMode: "cover" | "auto" | "contain" | "repeat" | "no-repeat",
  imageClassName: string,
  imageStyle: Object,
  zoomSrc: string,
  zoomOverlayColor: string,
  defineSrcViewports: Object
};

type State = {
  isLoaded: boolean,
  isRemoveTransition: boolean,
  position: number,
  isLazyLoaded: boolean,
  src: string,
  isZoom: boolean,
  imageZoomStyle: Object,
  prevImageZoomStyle: Object
};

const MIN_PARALLAX_SPEED: number = 0;
const MAX_PARALLAX_SPEED: number = 10;

export default class MyImage extends PureComponent<Props, State> {
  static defaultProps = {
    alt: "",
    ratio: "default",
    preview:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==",
    src:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==",
    containerClassName: "",
    containerStyle: {},
    useDefaultImage: false,
    useParallax: false,
    useLazyLoading: true,
    parallaxSpeed: 0,
    animationDisabled: false,
    scrollTarget: "window",
    resizeMode: "cover",
    imageClassName: "",
    imageStyle: {},
    zoomSrc: "",
    zoomOverlayColor: "#fff",
    defineSrcViewports: {}
  };

  state = {
    isLoaded: false,
    isRemoveTransition: false,
    position: 0,
    isLazyLoaded: false,
    src: "",
    isZoom: false,
    imageZoomStyle: {},
    prevImageZoomStyle: {}
  };

  _windowScrollTimeout = null;

  _removeTransitionTimeout = null;

  _timeout = null;

  _image = null;

  $containerImage: ?HTMLElement;

  async componentDidMount(): Promise<void> {
    const { useLazyLoading }: Props = this.props;
    this._setSrc();
    if (useLazyLoading) {
      if (this._checkConditionImageInScreen()) {
        this._createElementImage();
      }
    } else {
      this.setState({
        isLazyLoaded: true
      });
      this._createElementImage();
    }
    this._addParallax();
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { useParallax, useLazyLoading }: Props = this.props;
    const { isLazyLoaded }: State = this.state;
    if (useParallax !== prevProps.useParallax) {
      if (!useParallax) {
        this._removeParallax();
      } else {
        this._addParallax();
      }
    }
    if (useLazyLoading && isLazyLoaded !== prevState.isLazyLoaded) {
      this._createElementImage();
    }
  }

  componentWillUnmount(): void {
    if (this._image) {
      this._image.removeEventListener("load", this._handleImageLoad);
    }
    clearTimeout(this._removeTransitionTimeout);
    clearTimeout(this._timeout);
    clearTimeout(this._windowScrollTimeout);
    this._removeParallax();
  }

  _createElementImage = (): void => {
    const { src }: State = this.state;
    this._image = new Image();
    if (this._image) {
      this._image.src = src;
      this._image.addEventListener("load", this._handleImageLoad);
    }
  };

  _addParallax = (): void => {
    const { scrollTarget }: Props = this.props;
    this._handleWindowScroll();
    if (scrollTarget === "window") {
      window.addEventListener("scroll", this._handleWindowScroll);
    } else {
      const $scroller: ?HTMLElement = document.querySelector(scrollTarget);
      $scroller &&
        $scroller.addEventListener("scroll", this._handleWindowScroll);
    }
  };

  _removeParallax = (): void => {
    const { scrollTarget }: Props = this.props;
    if (scrollTarget === "window") {
      window.removeEventListener("scroll", this._handleWindowScroll);
    } else {
      const $scroller: ?HTMLElement = document.querySelector(scrollTarget);
      $scroller &&
        $scroller.removeEventListener("scroll", this._handleWindowScroll);
    }
  };

  _getWindowScrollTop = (): number => {
    return (
      (window.pageYOffset ||
        (document.documentElement ? document.documentElement.scrollTop : 0)) -
      (document.documentElement ? document.documentElement.clientTop : 0)
    );
  };

  /**
   * Hàm kiểm tra nếu ảnh nằm trong màn hình thì trả về true
   */
  _checkConditionImageInScreen = (): boolean => {
    const { top: containerImageOffsetTop }: { top: number } = offset(
      this.$containerImage
    );
    const containerImageHeight: number = this.$containerImage
      ? this.$containerImage.clientHeight
      : 0;
    const st: number = this._getWindowScrollTop();
    const windowHeight: number = window.innerHeight;
    return (
      st + windowHeight >= containerImageOffsetTop &&
      st <= containerImageOffsetTop + containerImageHeight
    );
  };

  /**
   * Kiểm tra parallaxSpeed trong khoảng 1 đến 10 thì trả về true
   */
  _checkSpeedCondition = (parallaxSpeed: number): boolean => {
    return (
      parallaxSpeed <= MAX_PARALLAX_SPEED && parallaxSpeed >= MIN_PARALLAX_SPEED
    );
  };

  _getParallaxPosition = (): number => {
    const { parallaxSpeed }: Props = this.props;
    const st: number = this._getWindowScrollTop();
    const { top: containerImageOffsetTop }: { top: number } = offset(
      this.$containerImage
    );
    const windowHeight: number = window.innerHeight;
    // Kiểm tra chỉ cho set parallaxSpeed trong khoảng 1 đến 10
    const speedCondition: boolean = this._checkSpeedCondition(parallaxSpeed);
    return speedCondition
      ? -(
          (st + windowHeight - containerImageOffsetTop) /
          (MAX_PARALLAX_SPEED + 2 - parallaxSpeed)
        )
      : 0;
  };

  _handleWindowScroll = (): void => {
    const { useParallax, useLazyLoading }: Props = this.props;
    this._windowScrollTimeout = setTimeout((): void => {
      // Kiểm tra xem ảnh nằm trong màn hình hay không
      if (this._checkConditionImageInScreen()) {
        if (useParallax) {
          const position: number = this._getParallaxPosition();
          this.setState({ position });
        }
        if (useLazyLoading) {
          this.setState({
            isLazyLoaded: true
          });
        }
      }
    }, 0);
  };

  _handleImageLoad = (): void => {
    this._timeout = setTimeout((): void => {
      this.setState({
        isLoaded: true
      });
    }, 0);
    this._removeTransitionTimeout = setTimeout((): void => {
      this.setState({
        isRemoveTransition: true
      });
    }, 450);
  };

  _handleImageError = (): void => {
    clearTimeout(this._timeout);
    clearTimeout(this._removeTransitionTimeout);
    clearTimeout(this._windowScrollTimeout);
    this.setState({
      isLoaded: false
    });
  };

  _beforeAnimated = async ({
    top,
    left,
    width,
    height
  }: Object): Promise<void> => {
    const imageZoomStyle: Object = {
      top,
      left,
      width,
      height,
      opacity: 0,
      padding: 0,
      overflow: "hidden"
    };
    await this.setState({
      imageZoomStyle,
      prevImageZoomStyle: imageZoomStyle
    });
  };

  _afterAnimated = ({ width, height }: Object): void => {
    const heightWithRatio: number = (height / width) * window.innerWidth;
    const widthWithRatio: number = (width / height) * window.innerHeight;
    const paddingVertical: number =
      heightWithRatio > window.innerHeight
        ? 15
        : (window.innerHeight - heightWithRatio) / 2;
    const paddingHorizontal: number =
      widthWithRatio > window.innerWidth
        ? 15
        : (window.innerWidth - widthWithRatio) / 2;
    this.setState({
      imageZoomStyle: {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        opacity: 1,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        overflow: "hidden auto"
      }
    });
  };

  _handleImageZoom = (type: string = ""): Function => async (
    event: Object
  ): Promise<void> => {
    const {
      top,
      left,
      width,
      height
    }: Object = event.currentTarget.getBoundingClientRect();
    if (type === "container") {
      await this.setState({
        isZoom: true
      });
      await this._beforeAnimated({ top, left, width, height });
      this._renderDomImageZoom();
    }
    await sleep(10);
    if (type === "container") {
      await this._afterAnimated({ width, height });
      window.addEventListener("resize", (): void => {
        return this._afterAnimated({ width, height });
      });
      this._setScrollBarOverflow("hidden", this._getScrollBarWidth());
    } else {
      const { prevImageZoomStyle }: State = this.state;
      const $imageZoom: ?HTMLElement = document.getElementById(
        "__wil_image_zoom__"
      );
      await this._beforeAnimated({
        top: prevImageZoomStyle.top,
        left: prevImageZoomStyle.left,
        width: prevImageZoomStyle.width,
        height: prevImageZoomStyle.height
      });
      await sleep(400);
      await this.setState({
        isZoom: false
      });
      $imageZoom && $imageZoom.remove();
      this._setScrollBarOverflow("", 0);
    }
  };

  _getImageAnimated = (type: string = "url"): Object => {
    const { animationDisabled }: Props = this.props;
    const { isLoaded, isRemoveTransition }: State = this.state;
    const condition: boolean =
      type === "url" ? isRemoveTransition : !isRemoveTransition;
    const opacityCondition: boolean = type === "url" ? isLoaded : !isLoaded;
    return !condition && !animationDisabled
      ? {
          opacity: `${opacityCondition ? 1 : 0}`,
          willChange: "opacity",
          transition: "opacity 200ms linear"
        }
      : {};
  };

  _getImageParallaxStyle = (): Object => {
    const { useParallax, parallaxSpeed }: Props = this.props;
    const { position }: State = this.state;
    return useParallax
      ? {
          backgroundAttachment: "fixed",
          backgroundPosition: !!parallaxSpeed ? `0 ${position}px` : "0 0"
        }
      : {
          backgroundPosition: "50% 50%"
        };
  };

  _getViewports = (srcObj: Object): Array<number> => {
    return Object.keys(srcObj).map((viewPort: string): number => {
      return Number(viewPort);
    });
  };

  _getSrcObj = (): Object => {
    const { src, defineSrcViewports }: Props = this.props;
    return Object.keys(src).reduce((acc: Object, cur: string): Object => {
      if (Object.keys(defineSrcViewports).includes(cur)) {
        return {
          ...acc,
          [defineSrcViewports[cur]]: src[cur]
        };
      }
      return {
        ...acc,
        [cur]: src[cur]
      };
    }, {});
  };

  _getSrc = (): string => {
    const { src }: Props = this.props;
    if (typeof src === "string") {
      return src;
    }
    const srcObj: Object = this._getSrcObj();
    const $wrapped: any = this.$containerImage
      ? this.$containerImage.parentNode
      : null;
    const { clientWidth }: { clientWidth: number } = $wrapped || {
      clientWidth: 0
    };
    const initialValue: string =
      srcObj[Math.max(...this._getViewports(srcObj))];
    return this._getViewports(srcObj)
      .sort((a: number, b: number): number => b - a)
      .reduce((acc: string, viewport: number): string => {
        if (viewport > clientWidth) {
          return srcObj[viewport];
        }
        return acc;
      }, initialValue);
  };

  _setScrollBarOverflow = (overflow: string, paddingRight: number): void => {
    const { scrollTarget }: Props = this.props;
    const $scrollTarget: ?HTMLElement =
      scrollTarget === "window"
        ? document.body
        : document.querySelector(scrollTarget);
    if ($scrollTarget) {
      $scrollTarget.style.overflow = overflow;
      $scrollTarget.style.paddingRight = !!paddingRight
        ? `${paddingRight}px`
        : "";
    }
  };

  _getScrollBarWidth = (): number => {
    const { scrollTarget }: Props = this.props;
    if (scrollTarget === "window") {
      return document.documentElement
        ? window.innerWidth - document.documentElement.clientWidth
        : 0;
    }
    const $scrollTarget: ?HTMLElement = document.querySelector(scrollTarget);
    return $scrollTarget
      ? $scrollTarget.offsetWidth - $scrollTarget.clientWidth
      : 0;
  };

  _setSrc = (): void => {
    this.setState({
      src: this._getSrc()
    });
  };

  _setImageRef = (c: any): void => {
    this.$containerImage = c;
  };

  _createImageZoom = (): void => {
    const el: HTMLElement = document.createElement("div");
    el.setAttribute("id", "__wil_image_zoom__");
    if (document.body) {
      document.body.appendChild(el);
    }
  };

  _renderDomImageZoom = async (): Promise<void> => {
    const { isZoom }: State = this.state;
    if (isZoom) {
      this._createImageZoom();
    }
    const $imageZoom: ?HTMLElement = document.getElementById(
      "__wil_image_zoom__"
    );
    if ($imageZoom) {
      if (isZoom) {
        render(
          <>
            {this._renderImageZoom()}
            {this._renderOverlay()}
          </>,
          $imageZoom
        );
      }
    }
  };

  _renderImageZoom = (): React$Node => {
    const { zoomSrc, alt }: Props = this.props;
    return (
      <div
        data-element="image"
        onClick={this._handleImageZoom()}
        role="presentation"
      >
        <img src={zoomSrc} alt={alt} style={{}} />
      </div>
    );
  };

  _renderOverlay = (): React$Node => {
    return <div data-element="overlay" />;
  };

  _renderPreview = (): React$Node => {
    const { preview }: Props = this.props;
    const { isRemoveTransition }: State = this.state;
    return (
      !!preview &&
      !isRemoveTransition && (
        <div
          className="absolute top-0 right-0 bottom-0 left-0 cover bg-center"
          style={{
            backgroundImage: `url("${preview}")`,
            ...this._getImageAnimated("preview")
          }}
        />
      )
    );
  };

  _renderImage = (): React$Node => {
    const {
      alt,
      ratio,
      useDefaultImage,
      resizeMode,
      imageClassName,
      imageStyle,
      preview,
      zoomSrc
    }: Props = this.props;
    const { isLazyLoaded, src, isZoom }: State = this.state;
    const _src: string = isLazyLoaded ? src : preview;
    return useDefaultImage ? (
      <img
        src={_src}
        alt={alt}
        style={{
          ...this._getImageAnimated(),
          ...(zoomSrc ? { cursor: isZoom ? "zoom-out" : "zoom-in" } : {}),
          ...(isZoom && zoomSrc ? { opacity: 0 } : {})
        }}
      />
    ) : (
      <div
        className={`bg-center aspect-ratio--${ratio} ${imageClassName}`.trim()}
        style={{
          backgroundSize: resizeMode,
          backgroundImage: `url("${_src}")`,
          willChange: "background-position",
          ...(zoomSrc ? { cursor: isZoom ? "zoom-out" : "zoom-in" } : {}),
          ...(isZoom && zoomSrc ? { opacity: 0 } : {}),
          ...this._getImageParallaxStyle(),
          ...this._getImageAnimated(),
          ...(ratio === "default"
            ? {
                width: "100%",
                height: "100%"
              }
            : {}),
          ...imageStyle
        }}
        title={alt}
      />
    );
  };

  _renderHelmetStyle = (): React$Node => {
    const { zoomSrc, zoomOverlayColor }: Props = this.props;
    const { isZoom, imageZoomStyle }: State = this.state;
    return (
      isZoom &&
      zoomSrc && (
        <Helmet>
          <style>
            {`#__wil_image_zoom__ [data-element="image"] {
            position: fixed;
            top: ${imageZoomStyle.top}px;
            left: ${imageZoomStyle.left}px;
            z-index: 1000;
            width: ${imageZoomStyle.width}px;
            height: ${imageZoomStyle.height}px;
            cursor: zoom-out;
            overflow: ${imageZoomStyle.overflow};
            padding: ${imageZoomStyle.padding};
            flex-wrap: wrap;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(.15,.97,.34,1);
            will-change: top, left, width, height;
            user-select: none;
          }
          #__wil_image_zoom__ [data-element="overlay"] {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${zoomOverlayColor};
            z-index: 999;
            opacity: ${imageZoomStyle.opacity};
            transition: all 0.4s cubic-bezier(.15,.97,.34,1);
            will-change: opacity;
          }`}
          </style>
        </Helmet>
      )
    );
  };

  render(): React$Node {
    const { containerClassName, containerStyle, zoomSrc }: Props = this.props;
    return (
      <div
        ref={this._setImageRef}
        className={`wil-image relative overflow-hidden ${containerClassName}`}
        style={containerStyle}
        role="presentation"
        {...(zoomSrc ? { onClick: this._handleImageZoom("container") } : {})}
      >
        {this._renderPreview()}
        {this._renderImage()}
        {this._renderHelmetStyle()}
      </div>
    );
  }
}
