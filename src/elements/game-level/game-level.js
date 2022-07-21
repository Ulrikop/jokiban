import Board from '../board/board.js';
import Player from '../player/player.js';
import Box from '../box/box.js';
import Spinner from '../spinner/spinner.js';
import { JoKiBanGame } from '../../components/game.js';
import { Level } from '../../components/levels/level.js';
import { addEventListener } from '../../components/utilities/addEventListener.js';

export default {
  components: {
    Board,
    Box,
    Player,
    Spinner,
  },

  props: {
    level: Level,
  },

  emits: ['solved'],

  data() {
    return {
      game: undefined,

      solved: false,
      animateSolved: false,

      cleanUp: undefined,
    };
  },

  // TODO watch required? changeable at runtime? if not, move into `data()`
  watch: {
    level: {
      handler(level) {
        this.loadLevel(level);
      },
      immediate: true,
    },
  },

  methods: {
    loadLevel(level) {
      this.game = new JoKiBanGame(level);

      this.initializeMoveableElements();
    },

    interpretMovementInstruction({ key }) {
      switch (key) {
        case 'ArrowLeft':
          return { rowDelta: 0, columnDelta: -1 };
        case 'ArrowRight':
          return { rowDelta: 0, columnDelta: 1 };
        case 'ArrowUp':
          return { rowDelta: -1, columnDelta: 0 };
        case 'ArrowDown':
          return { rowDelta: 1, columnDelta: 0 };
        default:
          // no movement key
          return;
      }
    },

    initializeMoveableElements() {
      this.movePlayer(this.game.playerPosition);

      for (const box of this.game.boxes) {
        this.moveBox(box);
      }
    },

    movePlayer(position) {
      if (!this.$refs.board || !this.$refs.player) {
        return;
      }

      this.$refs.board.getSquare(position).accommodate(this.$refs.player);
    },

    moveBox(box) {
      // vue.js stores ref in v-for automatically in array even if every element is stored in an own ref
      const boxElementList = this.$refs[`box-${box.id}`];
      const boxElement = boxElementList ? boxElementList[0] : undefined;

      if (!this.$refs.board || !boxElement) {
        return;
      }

      this.$refs.board.getSquare(box.position).accommodate(boxElement);
      boxElement.solved = box.solved;
    },

    solveAnimationFinished() {
      this.animateSolved = false;

      this.$emit('solved');
    },
  },

  mounted() {
    this.initializeMoveableElements();

    this.cleanUp = addEventListener('keydown', event => {
      const step = this.interpretMovementInstruction(event);

      if (!step) {
        return;
      }

      event.preventDefault();

      if (this.solved) {
        return;
      }

      const destination = this.game.go(step);

      if (!destination) {
        return;
      }

      this.movePlayer(destination.player);

      if (destination.box) {
        this.moveBox(destination.box);

        this.solved = this.game.boxes.every(box => box.solved);
        this.animateSolved = this.solved;
      }
    });
  },

  unmounted() {
    this.cleanUp();
  },

  template: `
<div class="game-level">
  <template v-if="game">
    <board :class="{solved: solved}" ref="board" :level="game.level">
      <player ref="player"></player>
      <box v-for="box in game.boxes" :ref="'box-' + box.id"></box>
    </board>

    <Transition name="solved" @after-enter="solveAnimationFinished()">
      <div class="solved-message" v-if="animateSolved">solved</div>
    </Transition>
  </template>

  <spinner v-else></spinner>
</div>
  `,
};
