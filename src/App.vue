 <template>
  <div>
    <div>
      <img src="./assets/images/logo.png" alt="">
      <img :src="logourl" alt="">
    </div>
    <div>
      {{ msg }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: this.square(2, 4, 6, 8),
      logourl: require('./assets/images/logo.png'),
    }
  },
  methods: {
    square() {
      let example = () => {
        let numbers = [];
        for (let number of arguments) {
          numbers.push(number * number);
        }

        return numbers;
      };
      return example();
    }
  }
}
</script>

<style>
html {
  height: 100%;
  background-image: url(./assets/images/bg.jpg);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
