#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { MemoryGameModule } from "./memorygame-module";
import { ImagePairModule } from "./imagepair-module";

try {
  yargs
    .command(new FlashcardsModule())
    .command(new DialogCardsModule())
    .command(new MemoryGameModule())
    .command(new ImagePairModule())

    .help().argv;
} catch (error) {
  console.error(error);
}
