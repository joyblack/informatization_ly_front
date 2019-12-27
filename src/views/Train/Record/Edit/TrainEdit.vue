<template>
    <a-modal
            :title="type ? '查看培训' : formData.id ? '编辑培训' : '新增培训'"
            :visible="visible"
            :width="720"
            @ok="!type ? handleSubmit() : handleCancel()"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="培训名称" v-bind="formItemLayout":label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                    <a-input
                        :disabled="type ? true : false "
                        v-decorator="['trainingName',{ 
                            initialValue: formData.trainingName,
                            rules: [{ required: !type ? true : false, message: '请输入培训名称!' }] }]"
                    />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="培训日期" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false "
                            v-decorator="[
                                'trainingTime',
                                { 
                                    initialValue:formData.trainingTime,
                                    rules: [{ required: !type ? true : false, message: '请选择培训日期！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="培训人" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-input
                            :disabled="type ? true : false"
                            v-decorator="['trainingUsername',{ 
                                initialValue: formData.trainingUsername,
                                rules: [{ required: !type ? true : false, message: '请输入培训人！' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="受训部门" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-cascader 
                            :options="departmentList ? departmentList : null" 
                            placeholder="" 
                            :disabled="type ? true : false"
                            v-decorator="[
                                'departmentId',
                                {
                                    initialValue: departmentId,
                                    rules: [{ required: !type ? true : false, message: '请选择受训部门！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="padding: 0 24px;">
                <a-form-item label="培训内容" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="['trainingContent',{ 
                            initialValue: formData.trainingContent,
                            rules: [{ required: !type ? true : false, message: '请输入培训内容！' }]
                        }]"
                    />
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="padding: 0 24px;">
                <a-form-item label="培训照片" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                    <div class="clearfix">
                        <a-upload
                          :disabled="type ? true : false"  
                          listType="picture-card"
                          :fileList="fileList"
                          :accept="acceptPics"
                          @preview="handlePreview"
                          @change="handleChangePics"
                        >
                            <div v-if="(fileList.length < 5 && !type)">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传照片</div>
                            </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handlePicsCancel">
                            <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                    </div>
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }' style="padding: 0 24px;">
                <a-form-item label="上传附件" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                    <a-upload
                        :beforeUpload="handleChangeFiles"
                        @change="handleChange"
                        :defaultFileList="defaultFileList"
                        >
                        <a-button style="width:102px;" :disabled="type ? true : false" v-if="defaultFileList.length < 5">
                          <a-icon type="upload" /> 上传
                        </a-button>
                    </a-upload>
                </a-form-item>
            </a-row>

        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, Select, Icon, DatePicker, Cascader, Tooltip, Radio, Upload, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        trainAdd: '/api/training-info/add',
        trainUpdate: '/api/training-info/update',
        trainById: '/api/training-info/get',
        photoUpload: '/api/upload/training-photo',//上传图片
        photoDownload: '/api/download/training-photo',//下载图片
        attachmentUpload: '/api/upload/training-attachment',//上传附件
        attachmentDownload: '/api/download/training-attachment',//下载附件
    }

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            ATextarea: Input.TextArea,
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ACascader: Cascader,
            ATooltip: Tooltip,
            ARadio: Radio,
            ARadioGroup: Radio.Group,
            AUpload: Upload
        },
        name: 'TrainEdit',
        props: {
            departmentList: Array
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
                formData: {
                    id: null,
                    trainingName: null,
                    trainingTime: null,
                    trainingUsername: null,
                    companyId: null,
                    departmentId: [],
                    trainPhotoId: null,
                    trainPhotoUrl: '',
                    oneInchPhotoId: null,
                    oneInchPhotoUrl: ''
                },
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
                departmentId: [],
                previewVisible: false,
                previewImage: '',
                fileList: [],
                defaultFileList: [],
                trainingPhotoIds: [],
                trainingAttachmentIds: [],
                acceptPics: '.png,.jpg,.bmp,.jpeg,.gif,.svg',
                acceptFiles: '.xls,.xlsx,.doc,.pdf,.txt,.png,.jpg,.bmp,.jpeg,.gif,.svg'
            }
        },
        mounted() {
            // this.getInfo();
        },
        methods: {
            openModal(record,type) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
                    this.type = type ? type : null;
                    http.post(dataUrl.trainById, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            let deArr = [];
                            let str = res.data.department.path.split('-');
                            let r = str.filter(function (s) {
                                return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                            });
                            let strData = r;
                            for (let j in strData) {
                                this.departmentId.push(Number(strData[j]))//字符串转Number类型
                            }
                            this.formData = {
                                id: record.id,
                                trainingName: res.data ? res.data.trainingName : null,
                                trainingTime: res.data ? moment(res.data.trainingTime, 'YYYY-MM-DD') : null,
                                trainingUsername: res.data ? res.data.trainingUsername : null,
                                trainingContent: res.data ? res.data.trainingContent : null
                            }
                            if(res.data.trainingPhotos.length > 0) {
                                res.data.trainingPhotos.map((item,index) =>
                                    this.fileList.push(
                                        {
                                            uid: item.id.toString(),
                                            name: item.fileName,
                                            status: 'done',
                                            url: dataUrl.photoDownload+'/'+item.id
                                        }
                                    )
                                )
                                this.fileList = this.fileList.slice(0,5);
                            }
                            if(res.data.trainingAttachments.length > 0) {
                                res.data.trainingAttachments.map((item,index) =>
                                    this.defaultFileList.push(
                                        {
                                            uid: item.id.toString(),
                                            name: item.fileName,
                                            status: 'done',
                                            url: dataUrl.attachmentDownload+'/'+item.id
                                        }
                                    )
                                )
                                this.defaultFileList = this.defaultFileList.slice(0,5);
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //下拉框搜索
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            //上传培训照片
            handleChangePics({ fileList }) {
                const formData = new FormData();
                this.trainingPhotoIds = [];
                formData.append('file', fileList[fileList.length-1].originFileObj);
                http.postFile(dataUrl.photoUpload, formData).then(res => {
                    if (res.state) {
                        message.success('上传成功');
                        this.fileList.push(
                            {
                                uid: res.data.id.toString(),
                                name: res.data.fileName,
                                status: 'done',
                                url: dataUrl.photoDownload+'/'+res.data.id
                            }
                        ) 
                        this.trainingPhotoIds = (this.fileList.map(item => {return parseInt(item.uid)}))                   
                    } else {
                        message.warning(res.message)
                    }
                })
                return false
            },
            handlePicsCancel () {
                this.previewVisible = false
            },
            //预览
            handlePreview (file) {
                this.previewImage = file.url || file.thumbUrl
                this.previewVisible = true
            },
            //附件
            handleChangeFiles(file,fileList) {
                const formData = new FormData();
                this.trainingAttachmentIds = [];
                formData.append('file', file);
                http.postFile(dataUrl.attachmentUpload, formData).then(res => {
                    if (res.state) {
                        message.success('上传成功');
                        this.defaultFileList.push(
                            {
                                uid: res.data.id.toString(),
                                name: res.data.fileName,
                                status: 'done',
                                url: dataUrl.attachmentDownload+'/'+res.data.id
                            }
                        )
                        this.trainingAttachmentIds = (this.defaultFileList.map(item => {return parseInt(item.uid)}))                    
                    } else {
                        message.warning(res.message)
                    }
                })
                return false
            },
            handleChange({file,fileList}) {
                fileList.map((item,index) => 
                    item.status = "done"
                );
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.trainUpdate : dataUrl.trainAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                trainingName: values.trainingName,
                                trainingTime: values.trainingTime.format('YYYY-MM-DD'),
                                trainingUsername: values.trainingUsername,
                                departmentId: parseInt(values.departmentId.slice(-1).toString()),
                                trainingContent: values.trainingContent,
                                trainingPhotoIds: this.trainingPhotoIds,
                                trainingAttachmentIds: this.trainingAttachmentIds
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.formData.id = res.data.id;
                                    this.$emit("comfirmAdd");
                                } else {
                                    message.warning(res.message)
                                }
                                this.confirmLoading = false
                            })
                        }
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.id = null;
                this.formData.trainingName = null;
                this.formData.trainingTime = null;
                this.formData.trainingUsername = null;
                this.formData.departmentId = [];                                
                this.formData.trainingContent = null;
                this.departmentId = [];
                this.previewVisible = false;
                this.previewImage = '';
                this.fileList = [];
                this.defaultFileList = [];
                this.trainingPhotoIds = [];
                this.trainingAttachmentIds = [];
                this.type = null;
                this.visible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style scoped>
</style>
