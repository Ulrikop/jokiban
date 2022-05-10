import Board from '../../elements/board/board.js';
import Player from '../../elements/player/player.js';
import Box from '../../elements/box/box.js';
import { SokobanGame } from '../../components/game.js';
import { Level } from '../../components/level.js';
import { addEventListener } from '../../components/utilities/addEventListener.js';

export default {
  components: {
    Board,
    Box,
    Player,
  },

  props: {
    level: Level,
  },

  data() {
    return {
      game: new SokobanGame(new Level()),

      solved: false,
      animateSolved: false,

      cleanUp: undefined,
    };
  },

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
      this.game = new SokobanGame(level);

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
      if (!this.game.playable) {
        return;
      }

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
<div>
  <template v-if="game.playable">
    <board :class="{solved: solved}" ref="board" :level="game.level">
      <player ref="player"></player>
      <box v-for="box in game.boxes" :ref="'box-' + box.id"></box>
    </board>

    <Transition name="solved" @after-enter="animateSolved = false">
      <div class="solved-message" v-if="animateSolved">solved</div>
    </Transition>
  </template>

  <template v-else>Invalid level</template>
</div>
  `,
};
