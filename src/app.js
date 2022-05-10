import Game from './views/game/game.js';
import Editor from './views/editor/editor.js';
import { SquareType } from './components/squareType.js';
import { Level } from './components/level.js';

Vue.createApp({
  components: {
    Game,
    Editor,
  },

  data() {
    return {
      currentTab: 'Game',
      tabs: ['Game', 'Editor'],
      level: new Level([
        [SquareType.Empty, SquareType.Goal, SquareType.Goal, SquareType.Empty],
        [SquareType.Empty, SquareType.Empty, SquareType.Empty, SquareType.Empty],
        [SquareType.Player, SquareType.Box, SquareType.Box, SquareType.Wall],
        [SquareType.Empty, SquareType.Empty, SquareType.Empty, SquareType.Wall],
      ]),
    };
  },
}).mount('#app');
