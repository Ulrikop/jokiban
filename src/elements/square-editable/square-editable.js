import Square from '../square/square.js';
import Player from '../player/player.js';
import Box from '../box/box.js';
import { SquareType } from '../../components/squareType.js';

export default {
  extends: Square,
  components: {
    Box,
    Player,
  },

  emits: ['change-type'],

  data() {
    return {
      SquareType,

      hover: false,
      typeChanged: false,
    };
  },

  methods: {
    changeType(squareType) {
      this.$emit('change-type', squareType);

      this.typeChanged = true;
    },
  },

  template: `
<div class="square-editable" @mouseenter="hover = true" @mouseleave="hover = false; typeChanged = false">
  <template v-if="hover && !typeChanged">
    <div class="square-type-select">
      <div class="square-type square-type-empty" @click="changeType(SquareType.Empty)"></div>
      <div class="square-type square-type-player" @click="changeType(SquareType.Player)">
        <player></player>
      </div>
      <div class="square-type square-type-box" @click="changeType(SquareType.Box)">
        <box></box>
      </div>
      <div class="square-type square-type-goal" @click="changeType(SquareType.Goal)"></div>
      <div class="square-type square-type-wall" @click="changeType(SquareType.Wall)"></div>
    </div>
  </template>
  <template v-else>
    <div class="square-type" :class="getClassOfType(type)">
        <player v-if="type === SquareType.Player"></player>
        <box v-else-if="type === SquareType.Box"></box>
    </div>
  </template>
</div>
  `,
};
