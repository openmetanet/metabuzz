<template>
    <div class="vue-uploader" :class="[{'loading loading-light-bg':loading},{'success':success&&showimg}]">
        <label ref="preview">
            <span v-if="!noTxt">{{ success ? (types === 2 ? '' : LANG('上传完成')) : getText }}</span>
            <input type="file" @change="handleFileChange" :accept="isImg ?'image/png,image/jpeg':'*/*'"/>
        </label>
    </div>
</template>

<script>
    import LANG from '../models/lang.model';

    export default {
        name: "vue-uploader",
        data() {
            return {
                loading: false,
                success: false
            }
        },
        props: {
            oldApi: {
                type: Boolean,
                default: false
            },
            noTxt: {
                type: Boolean,
                default: false
            },
            fileType: {
                type: Number,
                default: 4
            },
            types: {
                type: Number,
                default: 1   //1文件，2图片
            },
            text: {
                type: String,
                default: LANG('上传文件')

            },
            limit: { //容量限制，以M为单位
                type: Number,
                default: 3
            },
            showprocess: {
                type: String,
                default: ''
            },
            showimg: {
                type: Boolean,
                default: true
            },
            payWay: {},
            defaultUrl: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.init();
        },
        watch: {
            success: function (val) {
                if (!val && this.types === 2) {
                    this.$nextTick(function () {
                        this.$refs.preview.style.backgroundImage = 'none';
                    })
                }
            }
        },
        computed: {
            getText() {
                var text = LANG('上传文件');
                if (this.text == undefined) {
                    return text;
                }
                return this.text;
            },
            isImg() {
                return this.fileType == 3 || this.fileType == 7 || this.fileType == 8 || this.fileType == 9;
            }
        },
        methods: {
            init() {
                if (this.defaultUrl != '') {
                    console.log(this.defaultUrl)
                    this.$refs.preview.style.backgroundImage = `url(${this.defaultUrl})`;
                }
            },
            handleFileChange: function (e) {
                var files = e.target.files;
                if (files.length) {
                    this.uploadAction(files[0])
                }
            },
            uploadAction: function (file) {
                if (file.size > this.limit * 1024 * 1024) {
                    return JuaBox.showWrong(LANG(`文件大小不能大于[$1]M，请压缩后再重新上传`, this.limit));
                }

                var reader = new FileReader();

                reader.readAsDataURL(file); //读取file

                reader.onload = function (e) {
                    this.handleSubmit(file, function () {
                        this.success = true;
                        if (/image/i.test(file.type) && this.types === 2) {
                            if (this.showimg) {
                                this.$refs.preview.style.backgroundImage = 'url(' + e.target.result + ')'
                            }
                        } else {
                            this.$refs.preview.style.backgroundImage = 'none';
                        }
                    }.bind(this));
                }.bind(this);
            },
            handleSubmit: function (file, handleFile) {
                var formData = new FormData();
                var url;
                if (this.oldApi) {
                    formData.append("file", file);
                    var path = this.types === 1 ? '/uploadFile' : '/uploadKycImageJson';
                    url = DOMAIN_MAIN + API_PATH + '/user/kyc' + API_VERSION + path + `?type=${ this.fileType }`
                } else {
                    formData.append("fileUrl", file);
                    var path = this.types === 1 ? '/uploadFile' : '/uploadImage';
                    url = DOMAIN_MAIN + API_PATH + '/common' + API_VERSION + path + "?type=" + this.fileType + (this.payWay ? "&payWay=" + this.payWay : "")
                }
                _Method.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    timeout: 0,
                    beforeSend: () => {
                        this.loading = true;
                    },
                    success: (res) => {
                        handleFile();
                        this.$emit('success', res);
                    },
                    error: () => {
                        JuaBox.sure(LANG('上传失败，已终止!'));
                    },
                    complete: () => {
                        this.loading = false;
                    }
                })
            }
        }
    }
</script>

<style>
    .vue-uploader {
        position: relative;
    }

    .vue-uploader.success {
        border: 2px solid #FF8E43;
    }

    .vue-uploader label {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 10;
        margin: 0;
        cursor: pointer;
        background: transparent;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
    }

    .vue-uploader input[type=file] {
        display: none;
    }
</style>
