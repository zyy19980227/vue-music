import { playMode } from '../common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: true,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  toplist: {}
}

export default state
