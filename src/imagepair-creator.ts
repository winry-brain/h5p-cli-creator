import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pImagePairContent} from "./models/h5p-image-pair-content";
import { H5pImage } from "./models/h5p-image";
import { H5pMatch} from "./models/h5p-match";

export class ImagePairCreator extends ContentCreator<H5pImagePairContent> {
  constructor(
    h5pPackage: H5pPackage,
    private data: Array<{
      imageAlt: string;
      image?: string;
      match?: string;
      matchAlt?: string;
    }>,
    sourcePath: string
  ) {
    super(h5pPackage, sourcePath);
  }

  /**
   * Sets the description displayed when showing the memory game.
   * @param description
   */
  public setTitle(title: string) {
    this.h5pPackage.h5pMetadata.title = title;
    this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
  }

  protected contentObjectFactory(): H5pImagePairContent {
    return new H5pImagePairContent();
  }

  protected async addContent(
    contentObject: H5pImagePairContent
  ): Promise<void> {
    contentObject.cards = new Array();

    let imageCounter = 0;
    let matchCounter = 0;

    for (const line of this.data) {
      const cards = {
        imageAlt: line.imageAlt,
        matchAlt: line.matchAlt,
      };
      if (line.image) {
        try {
          let ret: { extension: string; buffer: Buffer; image: H5pImage };
          if (
            !line.image.startsWith("http://") &&
            !line.image.startsWith("https://")
          ) {
            ret = await H5pImage.fromLocalFile(
              path.join(this.sourcePath, line.image)
            );
          } else {
            ret = await H5pImage.fromDownload(line.image);
          }
          let filename = this.getFilenameForImage(
            imageCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.image.path = filename;
          cards["image"] = ret.image;
          console.log(
            `Downloaded image from ${line.image}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["image"] = undefined;
        }
      }
      if (line.match) {
        try {
          let ret: { extension: string; buffer: Buffer; match: H5pMatch };
          if (
            !line.match.startsWith("http://") &&
            !line.match.startsWith("https://")
          ) {
            ret = await H5pMatch.fromLocalFile(
              path.join(this.sourcePath, line.match)
            );
          } else {
            ret = await H5pMatch.fromDownload(line.match);
          }
          let filename = this.getFilenameForMatch(
            matchCounter++,
            ret.extension
          );
          this.h5pPackage.addContentFile(filename, ret.buffer);
          ret.match.path = filename;
          cards["match"] = ret.match;
          console.log(
            `Downloaded match from ${line.match}. (${ret.buffer.byteLength} bytes)`
          );
        } catch (exc) {
          console.error(exc);
          cards["match"] = undefined;
        }
      }
      contentObject.cards.push(cards);
    }
  }

  protected addSettings(contentObject: H5pImagePairContent) {
    contentObject.behaviour = {
      allowRetry: true,
    };
  }

  private getFilenameForImage(counter: number, extension: string) {
    return `images/image-${counter}${extension}`;
  }

  private getFilenameForMatch(counter: number, extension: string) {
    return `images/match-${counter}${extension}`;
  }

}
