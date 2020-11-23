<template>
  <div class="metafile-viewer">
    <img v-if="imgUrl" :src="imgUrl" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
  },
  directives: {
  }
})
export default class Metafile extends Vue {
  @Prop({
    type: String,
    required: true
  })
  src: string

  get imgUrl() {
    const fileId = this.src.split('//')[1]
    return fileId && fileId !== '' ? `${this.AppConfig.metaFileServiceUrl}/metafile/${fileId}` : null
  }
}
</script>

<style>
</style>
