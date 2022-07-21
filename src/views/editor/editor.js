import Board from '../../elements/board/board.js';
import GameLevel from '../../elements/game-level/game-level.js';
import { Level } from '../../components/levels/level.js';

export default {
  components: {
    Board,
    GameLevel,
  },

  data() {
    return {
      level: new Level(),
      playing: false,
    };
  },

  methods: {
    insertColumnAt(column) {
      this.level.insertColumnAt(column);
    },

    removeColumnAt(column) {
      this.level.removeColumnAt(column);
    },

    insertRowAt(row) {
      this.level.insertRowAt(row);
    },

    removeRowAt(row) {
      this.level.removeRowAt(row);
    },
  },

  template: `
<div class="editor">
  <div class="play-buttons">
    <img v-if="playing" class="button" src="/assets/images/edit.svg" @click="playing = false" />
    <img v-else class="button" src="/assets/images/play.svg" @click="playing = true" :class="{disabled: level.errors}" />
  </div>
  <div v-if="playing" class="board-playing">
    <game-level :level="level"></game-level>
  </div>
  <div v-else class="board-editor">
    <div class="column-toolbar">
      <div class="column-tool" v-for="(_, column) in level.columnCount">
        <button class="insert-before" @click="insertColumnAt(column)">+</button>
        <button class="remove" @click="removeColumnAt(column)" :disabled="level.columnCount < 2">-</button>
        <button class="insert-after" @click="insertColumnAt(column + 1)">+</button>
      </div>
    </div>
    <div class="board-container">
      <div class="row-toolbar">
        <div class="row-tool" v-for="(_, row) in level.rowCount">
          <button class="insert-before" @click="insertRowAt(row)">+</button>
          <button class="remove" @click="removeRowAt(row)" :disabled="level.rowCount < 2">-</button>
          <button class="insert-after" @click="insertRowAt(row + 1)">+</button>
        </div>
      </div>
      <board :level="level" edit-mode></board>
    </div>
  </div>
  <div class="result">
    <div class="title">
      Result
    </div>
    <div class="content">
      {{ level.serialize() }}
    </div>
  </div>
</div>
  `,
};
