<template>
    <div v-if="loading" class="spinner-wrapper" :style="wrapperStyle">
        <div class="sk-fading-circle" :style="circleStyle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'spinner',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#5dc596'
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    size: {
      type: [Number, String],
      default: '40'
    },
  },
  computed: {
    wrapperStyle() {
      return {
        backgroundColor: this.backgroundColor
      }
    },
    circleStyle() {
      return {
        width: this.size + 'px',
        height: this.size + 'px',
        'margin-left': '-' + Math.ceil(+this.size / 2) + 'px',
        'margin-top': '-' + Math.ceil(+this.size / 2) + 'px',
      }
    }
  }
}

</script>

<style>
    .spinner-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
    }
    .sk-fading-circle {
        width: 40px;
        height: 40px;
        left: 50%;
        top: 50%;
        margin-left: -20px;
        margin-top: -20px;
        position: absolute;
    }

    .sk-fading-circle .sk-circle {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .sk-fading-circle .sk-circle:before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 15%;
        height: 15%;
        background-color: #3BB3E4;
        border-radius: 100%;
        -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
        animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
    }
    .sk-fading-circle .sk-circle2 {
        -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
        transform: rotate(30deg);
    }
    .sk-fading-circle .sk-circle3 {
        -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
        transform: rotate(60deg);
    }
    .sk-fading-circle .sk-circle4 {
        -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
    }
    .sk-fading-circle .sk-circle5 {
        -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
        transform: rotate(120deg);
    }
    .sk-fading-circle .sk-circle6 {
        -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
        transform: rotate(150deg);
    }
    .sk-fading-circle .sk-circle7 {
        -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
    }
    .sk-fading-circle .sk-circle8 {
        -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
        transform: rotate(210deg);
    }
    .sk-fading-circle .sk-circle9 {
        -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
        transform: rotate(240deg);
    }
    .sk-fading-circle .sk-circle10 {
        -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
        transform: rotate(270deg);
    }
    .sk-fading-circle .sk-circle11 {
        -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
        transform: rotate(300deg);
    }
    .sk-fading-circle .sk-circle12 {
        -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
        transform: rotate(330deg);
    }
    .sk-fading-circle .sk-circle2:before {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }
    .sk-fading-circle .sk-circle3:before {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }
    .sk-fading-circle .sk-circle4:before {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }
    .sk-fading-circle .sk-circle5:before {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }
    .sk-fading-circle .sk-circle6:before {
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
    }
    .sk-fading-circle .sk-circle7:before {
        -webkit-animation-delay: -0.6s;
        animation-delay: -0.6s;
    }
    .sk-fading-circle .sk-circle8:before {
        -webkit-animation-delay: -0.5s;
        animation-delay: -0.5s;
    }
    .sk-fading-circle .sk-circle9:before {
        -webkit-animation-delay: -0.4s;
        animation-delay: -0.4s;
    }
    .sk-fading-circle .sk-circle10:before {
        -webkit-animation-delay: -0.3s;
        animation-delay: -0.3s;
    }
    .sk-fading-circle .sk-circle11:before {
        -webkit-animation-delay: -0.2s;
        animation-delay: -0.2s;
    }
    .sk-fading-circle .sk-circle12:before {
        -webkit-animation-delay: -0.1s;
        animation-delay: -0.1s;
    }

    @-webkit-keyframes sk-circleFadeDelay {
        0%, 39%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }

    @keyframes sk-circleFadeDelay {
        0%, 39%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }

</style>
