import React, { PureComponent } from "react";
import styles from "./CompareImage.module.scss";

export default class CompareImage extends PureComponent {
  static defaultProps = {
    lineWidth: 2,
    lineColor: "#fff",
    renderBeforeText: () => null,
    renderAfterText: () => null,
    renderButton: () => <div className={styles.buttonDefault} />
  };

  state = {
    position: 50,
    isStartDraggable: false
  };

  componentDidMount() {
    window.addEventListener("mousedown", this._handleStartDraggable);
    window.addEventListener("touchstart", this._handleStartDraggable);
    window.addEventListener("mousemove", this._handleDraggable);
    window.addEventListener("touchmove", this._handleDraggable);
    window.addEventListener("mouseup", this._handleDraggableEnd);
    window.addEventListener("touchend", this._handleDraggableEnd);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this._handleStartDraggable);
    window.removeEventListener("touchstart", this._handleStartDraggable);
    window.removeEventListener("mousemove", this._handleDraggable);
    window.removeEventListener("touchmove", this._handleDraggable);
    window.removeEventListener("mouseup", this._handleDraggableEnd);
    window.removeEventListener("touchend", this._handleDraggableEnd);
  }

  _handleStartDraggable = event => {
    const { pageX, target } = event.touches ? event.touches[0] : event;
    if (this.$container.contains(target)) {
      const position = this._getValueDragging(pageX);
      this.setState({ position, isStartDraggable: true });
    }
  };

  _handleDraggableEnd = () => {
    this.setState({
      isStartDraggable: false
    });
  };

  _getValueDragging = pageX => {
    const { containerWidth, containerOffsetLeft } = this._getContainerMeasure();
    if (pageX <= containerOffsetLeft) {
      return 0;
    }
    if (pageX >= containerWidth + containerOffsetLeft) {
      return 100;
    }
    return ((pageX - containerOffsetLeft) / containerWidth) * 100;
  };

  _handleDraggable = event => {
    const { isStartDraggable } = this.state;
    const { pageX, target } = event.touches ? event.touches[0] : event;
    if (isStartDraggable && this.$container.contains(target)) {
      const position = this._getValueDragging(pageX);
      this.setState({ position });
    }
  };

  _getContainerMeasure = () => {
    if (!this.$container) {
      return {
        containerWidth: 0,
        containerOffsetLeft: 0
      };
    }
    const { width, left } = this.$container.getBoundingClientRect();
    return {
      containerWidth: width,
      containerOffsetLeft: left + window.pageXOffset
    };
  };

  _setContainerRef = c => {
    this.$container = c;
  };

  _renderBeforeText = () => {
    const { renderBeforeText } = this.props;
    return <div className={styles.beforeText}>{renderBeforeText()}</div>;
  };

  _renderAfterText = () => {
    const { renderAfterText } = this.props;
    return <div className={styles.afterText}>{renderAfterText()}</div>;
  };

  _renderBeforeImage = () => {
    const { beforeImageUri } = this.props;
    const { position, isStartDraggable } = this.state;
    return (
      <div
        className={styles.beforeImage}
        style={{
          width: `${position}%`
        }}
      >
        <div
          className={styles.beforeImageInner}
          style={{
            backgroundImage: `url(${beforeImageUri})`
          }}
        />
        {!isStartDraggable && this._renderBeforeText()}
      </div>
    );
  };

  _renderAfterImage = () => {
    const { beforeImageUri, afterImageUri } = this.props;
    return (
      <img
        className={styles.afterImage}
        src={afterImageUri || beforeImageUri}
        alt=""
      />
    );
  };

  _renderDragItem = () => {
    const { lineWidth, lineColor, renderButton } = this.props;
    const { position } = this.state;
    return (
      <div className={styles.dragItemWrap}>
        <div
          className={styles.dragItem}
          style={{
            left: `${position}%`
          }}
        >
          <div
            className={styles.beforeLine}
            style={{
              width: lineWidth,
              backgroundColor: lineColor
            }}
          />
          <div className={styles.button}>{renderButton()}</div>
          <div
            className={styles.afterLine}
            style={{
              width: lineWidth,
              backgroundColor: lineColor
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    const { isStartDraggable } = this.state;
    return (
      <div className={styles.container} ref={this._setContainerRef}>
        {this._renderBeforeImage()}
        {this._renderAfterImage()}
        {this._renderDragItem()}
        {!isStartDraggable && this._renderAfterText()}
      </div>
    );
  }
}
