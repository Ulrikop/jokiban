import Spinner from '../spinner/spinner.js';
import { Level } from '../../components/levels/level.js';

export default {
  components: {
    Spinner,
  },

  props: {
    modelValue: Level,
  },
  emits: ['update:modelValue'],
  inject: ['levelLoader'],

  data() {
    return {
      levels: undefined,
      selectedLevel: undefined,
    };
  },

  methods: {
    onChanged() {
      if (!this.selectedLevel) {
        this.$emit('update:modelValue', undefined);
      } else {
        this.levelLoader.get(this.selectedLevel.file).then(level => {
          this.$emit('update:modelValue', level);
        });
      }
    },
  },

  mounted() {
    this.levelLoader.list().then(levels => {
      this.levels = levels;

      if (this.value) {
        this.selectedLevel = this.levels.find(level => level.name === this.value.name);
      } else if (this.levels.length > 0) {
        this.selectedLevel = this.levels[0];

        this.onChanged();
      }
    });
  },

  template: `
<spinner v-if="!levels" class="loading">Loading...</spinner>
<select v-else v-model="selectedLevel" @change="onChanged">
  <option style="display: none" value="">Select level...</option>
  <option v-for="level in levels" :value="level">
    {{ level.name }}
  </option>
</select>
  `,
};
