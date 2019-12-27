<template>
    <a-form
            :form="form"
            class="login-form"
            @submit="loginButton"
    >
        <h3 class="formTitle">登录账号</h3>

        <a-form-item v-bind="formItemLayout" style="margin-left:10%;margin-top:9%;margin-bottom:30px;">
            <a-input placeholder="用户名"
                     size="large"
                     style="height:50px;width:320px;"
                     v-decorator="['username',{ initialValue:formData.username,rules: [{ required: true, message: '请输入用户名' }]}]"
            >
                <a-icon
                        slot="prefix"
                        type="user"
                        style="color:#3683d3;font-size:24px;"
                />
            </a-input>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" style="margin-left: 10%">
            <a-input-password placeholder="密码"
                              size="large"
                              style="height:50px;width:320px;"
                              v-decorator="['password',{ initialValue:formData.password,rules: [{ required: true, message: '请输入密码' }] }]"
            >
                <a-icon
                        slot="prefix"
                        type="lock"
                        style="color:#3683d3;font-size:24px;"
                />
            </a-input-password>
        </a-form-item>

        <a-form-item v-bind="tailFormItemLayout" style="margin-left: 10%;margin-top: 8%">
            <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button">
                登 录
            </a-button>
        </a-form-item>
    </a-form>

</template>

<script>
    import {Form, Button, Input, message, Icon, Tooltip, Checkbox,} from 'ant-design-vue'
    import http from '../../../utils/http'

    const dataUrl = {
        loginData: '/api/login/login',
        getMyInformation: '/api/account/getMyInformation',
    };
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            AButton: Button,
            AInput: Input,
            AInputPassword: Input.Password,
            ATextarea: Input.TextArea,
            AIcon: Icon,
            ATooltip: Tooltip,
            ACheckbox: Checkbox,
        },
        name: 'Login',
        data() {
            return {
                formData: {
                    username: null,
                    password: null,
                },
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 24},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 20},
                        md: {span: 20},
                    },
                },
                tailFormItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 22},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 24},
                        md: {span: 20},
                    },
                },
            }
        },
        methods: {
            loginButton(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        http.post(dataUrl.loginData, {
                            loginName: values.username,
                            password: values.password,
                        }).then(res => {
                            if (res.state) {
                                //登录成功
                                this.$store.dispatch('changeAuthFun', true);
                                sessionStorage.isAuth = true;
                                sessionStorage.Authorization = res.data;
                                //获取用户信息，存入sessionStorage
                                http.post(dataUrl.getMyInformation, {}).then(res => {
                                    if (res.state){
                                        if (res.data){
                                            sessionStorage.id = res.data ? res.data.id : null;//当前登录账户ID
                                            sessionStorage.loginName = res.data ? res.data.loginName : null;//当前登录账户名
                                            sessionStorage.permissions = res.data ? res.data.permissions :null;
                                            this.$router.push({name: 'main'});
                                        }
                                    }else {
                                        message.error(res.message)
                                    }
                                })
                            } else {
                                message.error(res.message)
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
    form {
        position: fixed;
        top: 25%;
        left: 60%;
        width: 400px;
        height: 436px;
        background-image: url("../../../assets/loginFrame.png");
        background-size: cover;
        background-position: center top;
    }

    .formTitle {
        color: #fff;
        font-size: 24px;
        text-align: center;
        margin-top: 60px;
    }

    .card-title {
        margin: 0;
        color: #333;
        font-weight: 500;
        text-align: center;
        font-size: 28px;
    }

    .login-form-button {
        width: 320px;
        height: 50px;
        color: #022c39;
        font-size: 16px;
        border-color: #fec601;
        border-radius: 0;
        background-color: #fec601;
    }
</style>
