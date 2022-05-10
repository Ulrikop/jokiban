import Board from '../../elements/board/board.js';
import { Level } from '../../components/level.js';

export default {
  components: {
    Board,
  },
  props: {
    level: {
      type: Level,
      optional: new Level(),
    },
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
  <div class="board-editor">
    <div class="column-toolbar">
      <div class="column-tool" v-for="(_, column) in level.columnCount">
        <button class="insert-before" @click="insertColumnAt(column)">+</button>
        <button class="remove" @click="removeColumnAt(column)">-</button>
        <button class="insert-after" @click="insertColumnAt(column + 1)">+</button>
      </div>
    </div>
    <div class="board-container">
      <div class="row-toolbar">
        <div class="row-tool" v-for="(_, row) in level.rowCount">
          <button class="insert-before" @click="insertRowAt(row)">+</button>
          <button class="remove" @click="removeRowAt(row)">-</button>
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
      <div>[</div>
      <div v-for="(row, index) in level.squares">
      <span>&nbsp;&nbsp;</span>{{JSON.stringify(row)}}<span v-if="(index + 1) !== level.rowCount ">,</span>
      </div>
      <div>]</div>
    </div>
  </div>
</div>
  `,
};
