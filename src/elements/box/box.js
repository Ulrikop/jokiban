export default {
  data() {
    return {
      solved: false,
    };
  },

  template: `
<div class="box" :class="{'solved': solved}"></div>
  `,
};
