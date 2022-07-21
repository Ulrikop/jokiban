import GameLevel from '../../elements/game-level/game-level.js';
import LevelSelector from '../../elements/level-selector/level-selector.js';
import { Level } from '../../components/levels/level.js';

export default {
  components: {
    GameLevel,
    LevelSelector,
  },

  props: {
    // is start level. named just `level` to have same input like editor
    level: Level,
  },

  inject: ['levelLoader'],

  emits: ['update:level'],

  data() {
    return {
      running: !!this.level,
      levels: undefined,
      selectedLevel: undefined,
      currentLevel: this.level,
    };
  },

  methods: {
    onLevelSolved() {
      this.levelLoader.list().then(levels => {
        // TODO find a better solution for the level management
        const levelIndex = _.findIndex(levels, level => level.name === this.currentLevel.name);

        if (levelIndex < 0) {
          // level from editor
          return;
        }

        const nextLevel = levels[levelIndex + 1];

        if (!nextLevel) {
          this.running = false;

          return;
        }

        this.levelLoader.get(nextLevel.file).then(level => {
          this.changeLevel(level);
        });
      });
    },

    changeLevel(level) {
      console.log('LOAD', level.name);
      this.running = true;
      this.currentLevel = level;
      this.$emit('update:level', level);
    },
  },

  template: `
<div class="game">
  <template v-if="running">
    <game-level v-if="!currentLevel.errors" :level="currentLevel" :key="currentLevel.name" @solved="onLevelSolved"></game-level>

    <template v-else>Invalid level</template>
  </template>
  <template v-else>
    <div>Selected: {{ selectedLevel }}</div>
    <level-selector v-model="selectedLevel"></level-selector>
    <button :disabled="!selectedLevel" @click="changeLevel(selectedLevel)">GOGO</button>
  </template>
</div>
  `,
};
