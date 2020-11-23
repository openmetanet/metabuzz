<template>
  <div class="metafile-uploader">
    <div class="add-img" @click="showPopup = true">
      <i class="svg-icon">
        <svg width="1.0625em" height="1em" viewBox="0 0 17 16" class="bi bi-image" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v9l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094L15.002 9.5V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
      </i>
      <span>
        添加图片
      </span>
    </div>
    <transition name="fade">
      <div class="popup-content" v-show="showPopup">
        <div class="btn-close" @click="closePopup">
          <i class="svg-icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </i>
        </div>
        <div class="popup-header">本地上传</div>
        <div class="popup-body">
          <div class="preview-wrap" >
            <div class="image-preview" v-for="(image, index) in images" :key="index" >
              <!-- <img :src="displayImage(image)" :alt="image.fileName" /> -->
              <img :src="image.base64" :alt="image.fileName" />
              <!-- base64{{image.base64}} -->
            </div>
            <label class="btn-add">
              <i class="svg-icon">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </i>
              <input type="file" class="file-input" @change="handleFileChange" accept="image/*" multiple />
            </label>
          </div>
          <div class="action-wrapper">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
// import { hexToBase64Img } from '@/utils/metaid'

interface ImageObjTypes {
  fileName?: string;
  fileType: string;
  hex?: string;
  blob?: string;
  base64?: string | ArrayBuffer;
  binary?: Buffer;
}

@Component({
  components: {
  },
  directives: {
  }
})
export default class MetafileUploader extends Vue {
  @Prop({
    type: String,
    // required: true
  })
  src: string

  showPopup = false
  images: ImageObjTypes[] = []
  imageData = ''

  get imgUrl() {
    const fileId = this.src.split('//')[1]
    return fileId && fileId !== '' ? `https://showman.showpay.io/metafile/${fileId}` : null
  }

  closePopup() {
    this.showPopup = false
    this.$emit('close')
  }
  async handleFileChange(e) {
    const files = e.target.files
    for (let i = 0; i < files.length && i < 9; i++) {
      const imageObj = await this.processImage(files[i])
      this.images.push(imageObj)
    }
    this.$emit('change', this.images)
  }
  processImage(file) {
    return new Promise<ImageObjTypes>((resolve, reject) => {
      const reader = new FileReader(), image = new Image()
      const fileName = file.name
      try {
        reader.onload = (event) => {
          const imgFile = event.target.result
          image.src = imgFile
          image.onload = (e) => {
            const img = e.target
            const w = img.width, h = img.height, scale = w / h
            const canvas = document.createElement('canvas'),
              context = canvas.getContext('2d'),
              imageWidth = w > 800 ? 800 : w,
              imageHeight = w > 800 ? Math.ceil(800 / scale) : h

            canvas.width = imageWidth
            canvas.height = imageHeight
            context.drawImage(image, 0, 0, imageWidth, imageHeight)
            const base64 = canvas.toDataURL()
            canvas.toBlob(async (blob) => {
              const binary = await this.fileToBinary(blob)
              const imageObj: ImageObjTypes = {
                fileName: fileName,
                fileType: blob.type,
                base64: base64,
                binary: binary,
                data: binary.toString('hex')
              }
              resolve(imageObj)
            }, 'image/jpeg', 0.6)
          }
        }
      } catch (error) {
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  }
  fileToBinary(fileBlob) {
    return new Promise<Buffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result
        if (arrayBuffer) {
          resolve(Buffer.from(arrayBuffer))
          // console.log('buffer', buffer)
          // fileBinary = buffer
        } else {
          reject(new Error('File error'))
        }
      }
      reader.readAsArrayBuffer(fileBlob)
    })
  }
}
</script>

<style lang="scss">
  .metafile-uploader {
    position: relative;
    .svg-icon svg {
      width: 16px;
      height: 16px;
    }
    .add-img {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .popup-content {
      position: absolute;
      width: 290px;
      left: 0;
      top: 100%;
      padding: 16px;
      background: #FFF;
      color: #333;
      margin-top: 10px;
      border-radius: 6px;
      z-index: 100;
      &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: -10px;
        left: 30px;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #FFF;
      }
      .btn-close {
        position: absolute;
        top: 15px;
        right: 10px;
      }
      .popup-header {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .popup-body {
        padding: 10px;
        .preview-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          padding: 10px 0;
          .image-preview {
            width: 80px;
            height: 80px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #E5E5E5;
            overflow: hidden;
            margin: 4px;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
        }
        .btn-add {
          display: inline-flex;
          width: 80px;
          height: 80px;
          align-items: center;
          justify-content: center;
          border: 1px dashed #474F62;
          .svg-icon svg {
            color: #474F62;
            width: 20px;
            height: 20px;
          }
          .file-input {
            display: none;
          }
        }
      }
    }
  }
</style>
