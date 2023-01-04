import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";
import { H5pMatch } from "./h5p-match";

export class H5pImagePairContent extends H5pContent {
  public title: string;
  public cards: {
    imageAlt: string;
    image?: H5pImage;
    match?: H5pMatch;
    matchAlt?: string;
    description?: string;
  }[];
  public behaviour: {
    allowRetry: boolean;
  };
}
