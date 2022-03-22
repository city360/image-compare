// @flow
import React, { PureComponent } from "react";
import * as R from "ramda";

type Props = {
  data: Array<Object>
};

export default class Gallery extends PureComponent<Props> {
  _renderItem = (item: Object, index: number): React$Node => {
    return (
      <div key={index}>
        <div>{item.image}</div>
      </div>
    );
  };

  render(): React$Node {
    const { data }: Props = this.props;
    return <div>{!R.isEmpty(data) && data.map(this._renderItem)}</div>;
  }
}
