<template>
  <div class="buzz-detail">
    <div class="buzz-container">
      <template v-if="buzzData.txId">
        <quote-item
          :buzz="buzzData"
          :is-detail="true"
          v-if="buzzData.parentNodeName.toLowerCase() === 'simplerepost'"
        />
        <buzz-item :buzz="buzzData" :is-detail="true" v-else />
      </template>
    </div>
    <asideBox />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getBuzzDetail } from '@/api/metasv-buzz'
import BuzzItem from './_buzz-item.vue'
import QuoteItem from './_quote-item.vue'
import AsideBox from '@views/metasv-buzz/_aside.vue'
@Component({
  components: {
    BuzzItem,
    QuoteItem,
    AsideBox,
  },
})
export default class BuzzDetail extends Vue {
  buzzId: string | undefined
  buzzData = {
    parentNodeName: ''
  }

  @Watch('$route', { immediate: true })
  onRouteChange(to) {
    // if (to.params.id === from)
    this.buzzId = to.params.id
    this.getBuzzDetail()
  }

  getBuzzDetail() {
    getBuzzDetail(this.buzzId).then(res => {
      if (res.code === 200) {
        this.buzzData = res.result.data[0]
      }
    })
  }
  created() {
    this.buzzId = this.$route.params.id
    this.getBuzzDetail()
  }
}
</script>

<style lang="scss">
.buzz-detail {
  // min-height: calc(100vh - 50px);
  max-width: 1200px;
  padding: 0 10px;
  width: 100%;
  padding-top: 12px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .buzz-container {
    max-width: 736px;
    width: 100%;
    margin: 0 15px;
  }
  .buzz-item {
    &.buzz-SimpleRePost {
      background: #2f374a;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
</style>
