// @flow
import React, { memo } from "react";
import Gallery from "../Gallery/Gallery";
import objectParse from "../../../utils/functions/objectParse";

type Props = {
  attribs: Object
};

function ShortCodeGallery({ attribs }: Props): React$Node {
  const gallery: string = attribs["data-gallery"];
  const column: string = attribs["data-column"];
  const data: Array<Object> = objectParse(gallery);
  return <Gallery data={data} column={column} />;
}

export default memo<Props>(ShortCodeGallery);
