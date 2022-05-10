import Square from '../square/square.js';
import SquareEditable from '../square-editable/square-editable.js';
import { Level } from '../../components/level.js';

export default {
  components: {
    Square,
    SquareEditable,
  },

  props: {
    level: Level,
    editMode: Boolean,
  },

  methods: {
    getSquare({ row, column }) {
      return this.$refs[`square-${row}/${column}`][0];
    },

    changeType(position, squareType) {
      this.level.changeType(position, squareType);
    },
  },

  template: `
<div class="board">
  <div class="row" v-for="(_, row) in level.rowCount">
    <div class="square" v-for="(_, column) in level.columnCount">
    <component :is="editMode? 'square-editable' : 'square' " :type="level.getSquare({row, column})" :ref="'square-' + row + '/' + column" @change-type="squareType => changeType({row, column}, squareType)"></component>
    </div>
  </div>
  <slot></slot>
</div>
  `,
};
