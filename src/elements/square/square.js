import { SquareType } from '../../components/squareType.js';

export default {
  props: ['type'],

  methods: {
    accommodate(element) {
      this.$refs.squareType.append(element.$el);
    },

    getClassOfType(type) {
      switch (type) {
        case SquareType.Wall:
          return 'square-type-wall';

        case SquareType.Goal:
          return 'square-type-goal';

        case SquareType.Box:
        case SquareType.Player:
        case SquareType.Empty:
          return 'square-type-empty';

        default:
          throw new Error(`Unknown square type ${type}`);
      }
    },
  },

  template: `
  <div class="square-type" :class="getClassOfType(type)" ref="squareType"></div>
  `,
};
