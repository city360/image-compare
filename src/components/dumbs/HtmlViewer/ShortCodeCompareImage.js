// @flow
import React, { memo } from "react";
import CompareImage from "../CompareImage/CompareImage";

type Props = {
  attribs: Object
};

function renderBeforeText(beforeText): Function {
  return (): React$Node => {
    return <div className="bg-black white pv2 ph3">{beforeText}</div>;
  };
}

function renderAfterText(afterText): Function {
  return (): React$Node => {
    return <div className="bg-black white pv2 ph3">{afterText}</div>;
  };
}

function ShortCodeCompareImage({ attribs }: Props): React$Node {
  const beforeImageUri: string = attribs["data-before-image"];
  const afterImageUri: string = attribs["data-after-image"];
  const beforeText: string = attribs["data-before-text"];
  const afterText: string = attribs["data-after-text"];
  return (
    <CompareImage
      beforeImageUri={beforeImageUri}
      afterImageUri={afterImageUri}
      renderBeforeText={renderBeforeText(beforeText)}
      renderAfterText={renderAfterText(afterText)}
    />
  );
}

export default memo<Props>(ShortCodeCompareImage);
