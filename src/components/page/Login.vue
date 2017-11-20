<template>
    <div class="login-wrap">
        <div class="ms-title">雅高企业班线系统</div>
        <div class="ms-login">
            <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p class="login-tips">Tips : 用户名和密码随便填。</p>
            </el-form> -->
            <el-tabs v-model="activeName">
                <el-tab-pane label="登录" name="login">
                    <el-form :model="loginForm" :rules="rules" label-width="100px" ref="loginForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="loginForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                            <el-button @click="resetForm('loginForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="注册" name="register">
                    <Register></Register>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<script>

    import api from '../../axios.js'
    //引入验证组件
    import Register from './Register.vue'

    // export default {
    //     data: function(){
    //         return {
    //             ruleForm: {
    //                 username: '',
    //                 password: ''
    //             },
    //             rules: {
    //                 username: [
    //                     { required: true, message: '请输入用户名', trigger: 'blur' }
    //                 ],
    //                 password: [
    //                     { required: true, message: '请输入密码', trigger: 'blur' }
    //                 ]
    //             }
    //         }
    //     },
    //     methods: {
    //         submitForm(formName) {
    //             const self = this;
    //             self.$refs[formName].validate((valid) => {
    //                 if (valid) {
    //                     localStorage.setItem('ms_username',self.ruleForm.username);
    //                     // 此处进行校验，若校验成功，则跳转
    //                     self.$router.push('/index');
    //                 } else {
    //                     console.log('error submit!!');
    //                     return false;
    //                 }
    //             });
    //         }
    //     }
    // }
    // export default {
    //     data(){
    //         return {
    //             activeName: 'login', //选项卡
    //             loginForm: {        //表单v-model的值
    //                 username: '',
    //                 password: ''
    //             },
    //             rules: { //验证规则
    //                 username: [
    //                     { required: true, message: '用户名不能少', trigger: 'blur'},
    //                     { min: 6, max: 16, message: '用户名在6到16位之间', trigger: 'blur'}
    //                 ],
    //                 password: [
    //                     { required: true, message: '请输入密码', trigger: 'blur'}
    //                 ]
    //             }
    //         }
    //     },
    //     methods: {
    //         resetForm(formName){
    //             this.$refs[formName].resetFields();
    //         },
    //         submitForm(formName){
    //             this.$refs[formName].validate((valid) => {
    //                 if(valid){ //验证通过
    //                     let opt = this.loginForm;
    //                     api.userLogin(opt)
    //                         .then(({ data }) => {     //解构赋值拿到data
    //                             //账号不存在
    //                             if(data.info === false){
    //                                 this.$message({
    //                                     type: 'info',
    //                                     message: '账号不存在'
    //                                 });
    //                                 return ;
    //                             }
    //                             //账号存在
    //                             if(data.success){
    //                                 this.$message({
    //                                     type: 'success',
    //                                     message: '登录成功'
    //                                 })
    //                                 let token = data.token;
    //                                 let username = data.username;
    //                                 this.$store.dispatch('UserLogin', token);
    //                                 this.$store.dispatch('UserName', username);
    //                                 //如果用户手动输入"/"那么会跳转到这里来，即this.$route.query.redirect有参数
    //                                 let redirectUrl = decodeURIComponent(this.$route.query.redirect || '/');
    //                                 //跳转到指定的路由
    //                                 this.$router.push({
    //                                     path: redirectUrl
    //                                 });
    //                             }else{
    //                                 this.$message({
    //                                     type: 'info',
    //                                     message: '密码错误！'
    //                                 });
    //                             }
    //                         });
    //                 }else{ 
    //                     //验证不通过
    //                     return false;
    //                 }
    //             });
    //         }
    //     },
    //     components: {
    //         Register
    //     }
    // }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    .login-tips {
         font-size:12px;
         line-height:30px;
         color:#999;
    }
</style>