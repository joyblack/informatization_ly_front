<template>
    <a-modal
            :title="'导入提示'"
            :visible="visible"
            :width="600"
            :footer="null"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :maskClosable="true"
            :keyboard="true"
    >
        <p style="text-align:center;font-size:16px;">请选择导入类型：</p>
        <div style="display:flex;justify-content:center;margin:20px 0;">
            <a-upload name="file" :showUploadList="false" :accept="acceptFiles" @change="importLeaveData">
                <a-button type="primary">
                    已办理离职手续导入
                </a-button>
            </a-upload>
            <a-upload name="file" :showUploadList="false" :accept="acceptFiles" @change="importNotLeaveData">
                <a-button type="primary" style="margin: 0 20px;">
                    未办理离职手续导入
                </a-button>
            </a-upload>
            <a-upload name="file" :showUploadList="false" :accept="acceptFiles" @change="importIllData">
                <a-button type="primary">
                    疑似职业病导入
                </a-button>
            </a-upload>
        </div>
        <!-- 导入时错误信息提示 -->
        <a-modal title="导入结果" v-model="errorVisible" @ok="handleOk" class="errorModal">
            <p v-for="(item,index) in importDatas" :key="index">{{(index+1) + '、' + item}}</p>
        </a-modal>
    </a-modal>
</template>

<script>
    import {Modal, Button, Upload, message} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        importLeaveData: '/api/staff-leave/import/LEAVE_OFFICE_YES',
        importNotLeaveData: '/api/staff-leave/import/LEAVE_OFFICE_NO',
        importIllData: '/api/staff-leave/import/LEAVE_DISEASE',
    }

    export default {
        components: {
            AModal: Modal,
            AButton: Button,
            AUpload: Upload
        },
        name: 'UploadComfirm',
        mounted() {
        },
        data() {
            return {
                type: null,
                loading: false,
                visible: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 7},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 10},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 10, offset: 7},
                    },
                },
                importType: null,
                errorVisible: false,
                importDatas: [],
                acceptFiles: '.xls,.xlsx'
            }
        },
        methods: {
            openModal() {
                this.visible = true;
            },
            //导入已办理离职手续
            importLeaveData(info) {
                if(info.file.status !== 'uploading') {
                    this.importDatas = [];
                    this.errorVisible = false;
                    const formData = new FormData();
                    formData.append('file', info.file.originFileObj);
                    http.postFile(dataUrl.importLeaveData, formData).then(res => {
                        if (res.state) {
                            if(res.data.length === 0) {
                                message.success('导入成功！');
                                this.visible = false;
                                this.$emit("comfirmAdd");
                            } else {
                                this.importDatas = res.data;
                                this.errorVisible = true;
                            }                   
                        } else {
                            message.warning(res.message)
                        }
                    })
                    return false
                }
            },
            //导入未办理离职手续
            importNotLeaveData(info) {
                if(info.file.status !== 'uploading') {
                    this.importDatas = [];
                    this.errorVisible = false;
                    const formData = new FormData();
                    formData.append('file', info.file.originFileObj);
                    http.postFile(dataUrl.importNotLeaveData, formData).then(res => {
                        if (res.state) {
                            if(res.data.length === 0) {
                                message.success('导入成功！');
                                this.visible = false;
                                this.$emit("comfirmAdd");
                            } else {
                                this.importDatas = res.data;
                                this.errorVisible = true;
                            }                   
                        } else {
                            message.warning(res.message)
                        }
                    })
                    return false
                }
            },
            //导入职业病
            importIllData(info) {
                if(info.file.status !== 'uploading') {
                    this.importDatas = [];
                    this.errorVisible = false;
                    const formData = new FormData();
                    formData.append('file', info.file.originFileObj);
                    http.postFile(dataUrl.importIllData, formData).then(res => {
                        if (res.state) {
                            if(res.data.length === 0) {
                                message.success('导入成功！');
                                this.visible = false;
                                this.$emit("comfirmAdd");
                            } else {
                                this.importDatas = res.data;
                                this.errorVisible = true;
                            }                   
                        } else {
                            message.warning(res.message)
                        }
                    })
                    return false
                }
            },
            handleOk(e) {
                console.log(e);
                this.errorVisible = false;
                this.visible = false
                this.$emit("comfirmAdd");
            },
            //取消
            handleCancel() {
                this.visible = false;
                this.errorVisible = false;
            },
            afterClose() {
                this.importType = null;
                this.visible = false;
                this.errorVisible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style scoped>
    .errorTips {
        color: #f5222d;
        width: 300px;
        position: absolute;
        left: 112px;
    }
</style>
