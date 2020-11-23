<template>
  <div class="media-container">
    <div class="title">我的媒体</div>
    <div class="content">
      <div class="item" v-for="(metafile, index) in mediaList" :key="index">
        <meta-image v-if="metafile !== ''" :src="getImageUrl(metafile.txId)" :preview-src-list="getPreviewList(mediaList)" />
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types'
import { queryMetaIdData } from '@/api/metasv-buzz'
import MetaImage from '@comps/image/index.vue'
// import { Getter } from 'vuex-class'
@Component({
  components: {
    MetaImage
  }
})
export default class MediaList extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  user: UserInfoTypes

  pageNum = 1
  pageSize = 20
  mediaList: MetaIdDataTypes[] = []
  // @Getter('userInfo') currentUser: UserInfoTypes

  getMediaList() {
    const params = {
      find: {
        parentNodeName: 'MetaFile',
        metaId: this.AppConfig.metaIdTag,
        rootTxId: this.user.metaId,
        parentTxTd: { $ne: this.user.protocolTxId }
      },
      sort: {
        timestamp: -1
      },
      skip: this.pageNum,
      limit: this.pageSize
    }
    queryMetaIdData(params).then(res => {
      const list = res.result.data
      this.mediaList = list
    }).catch(error => {
      console.error(error)
    })
  }
  getImageUrl(fileId) {
    return `${this.AppConfig.showManUrl}/metafile/${fileId}`
  }
  getPreviewList(files: MetaIdDataTypes[]) {
    const fileList = []
    if (files && files.length) {
      files.forEach(file => {
        fileList.push(this.getImageUrl(file.txId))
      })
    }
    return fileList
  }
  created() {
    this.getMediaList()
  }
}
</script>
<style lang="scss">
.media-container {
  max-width: 992px;
  margin-left: 20px;
  width: 100%;
  .title {
    padding: 30px 0 30px 20px;
    background: #474f62;
    font-size: 18px;
    line-height: 16px;
    margin-bottom: 1px;
  }
  .content {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #474f62;
  }
  .item {
    display: inline-block;
    margin: 6px 0;
    .metafile-viewer {
      width: 229px;
      height: 229px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
