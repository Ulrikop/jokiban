import Game from './views/game/game.js';
import Editor from './views/editor/editor.js';
import { LevelLoader } from './components/levels/levelLoader.js';
import { parseLevelsFromPythonServer } from './components/levels/parseLevelsFromPythonServer.js';
import { Level } from './components/levels/level.js';
import { SquareType } from './components/squareType.js';

const app = Vue.createApp({
  components: {
    Game,
    Editor,
  },

  data() {
    return {
      currentTab: 'Game',
      tabs: ['Game', 'Editor'],
      // level: new Level('foo', {
      //   board: [
      //     [SquareType.Empty, SquareType.Goal, SquareType.Goal, SquareType.Empty],
      //     [SquareType.Empty, SquareType.Empty, SquareType.Empty, SquareType.Empty],
      //     [SquareType.Player, SquareType.Box, SquareType.Box, SquareType.Wall],
      //     [SquareType.Empty, SquareType.Empty, SquareType.Empty, SquareType.Wall],
      //   ],
      // }),
    };
  },
});

app.provide('levelLoader', new LevelLoader({ listParser: parseLevelsFromPythonServer })).mount('#app');
