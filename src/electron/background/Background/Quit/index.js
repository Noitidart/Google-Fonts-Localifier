// @flow

import { app } from 'electron'

import type { Shape as QuitShape } from '../../../flows/quit'

function Quit(quit: QuitShape) {
    if (quit) app.quit();
}

export default Quit