<template>
    <div class="login-wrap"  ref='canvasWrap'>
        <div class="ms-title">雅高班线定制</div>
        <div class="ms-login">
            <el-tabs id="loginTabs" v-model="activeName">
                <el-tab-pane label="登录" name="login">
                    <el-form :model="loginForm" :rules="rules" label-width="80px" ref="loginForm">
                        <el-form-item label="用户名" prop="name">
                            <el-input v-model="loginForm.name"type="name" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" @keyup.enter.native="submitForm('loginForm')"></el-input>
                        </el-form-item>
                        <el-form-item  label-width="0">
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
    import api from 'api/http'
    import Register from './Register'
    import {mapMutations} from 'vuex'
    // import * as THREE from 'three'
    // import * as CanvasRenderer from './CanvasRenderer'
    // import * as Projector from './Projector'
    // import * as stats from './stats.min.js'


    export default {
        data: function(){
            return {
                activeName: 'login', //选项卡
                loginForm: {        //表单v-model的值
                    name: '',
                    password: ''
                },
                rules: { //验证规则
                    name: [
                        { required: true, message: '用户名不能少', trigger: 'blur'},
                        { min: 5, max: 16, message: '用户名在6到16位之间', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.initWave();
        },
        components: {
            Register
        },
        methods: {
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){ //验证通过
                        let opt = this.loginForm;
                        api.userLogin(opt).then(({ data }) => {     //解构赋值拿到data
                            //账号不存在
                            if(data.info === false){
                                this.$message({
                                    type: 'info',
                                    message: '账号不存在'
                                });
                                return ;
                            }
                            //账号存在
                            this.$message({
                                type: 'success',
                                message: '登录成功'
                            })
                            let auth_token = data.auth_token;
                            let username = data.name;
                            // 设置token和用户名
                            // this.$store.dispatch('UserLogin', auth_token);
                            // this.$store.dispatch('UserName', this.loginForm.name); 
                            this.setToken(auth_token);
                            this.setUsername(name);

                            this.$refs[formName].resetFields();
                            //如果用户手动输入"/"那么会跳转到这里来，即this.$route.query.redirect有参数
                            // let redirectUrl = decodeURIComponent(this.$route.query.redirect || '/');
                            let redirectUrl = '/viewBusLine';
                            //跳转到指定的路由
                            this.$router.push({
                                path: redirectUrl
                            });

                            // this.$message({
                            //     type: 'info',
                            //     message: '密码错误！'
                            // });

                        });
                    } else { 
                        //验证不通过
                        return false;
                    }
                });
            },
            //初始化wave背景
            initWave() {
                let self = this;
                //111
                var SEPARATION = 100, 
                    AMOUNTX = 100, 
                    AMOUNTY = 70;

                var container;
                var camera, scene, renderer;

                var particles, particle, count = 0;

                var mouseX = 85, 
                    mouseY = -342;

                var windowHalfX = window.innerWidth / 2;
                var windowHalfY = window.innerHeight / 2;

                init();
                animate();
                
                function init() {
                    container = document.createElement( 'div' );
                    // $container = self.$refs.canvasWrap;
                    self.$nextTick(() => { 
                        // $container = self.$refs.canvasWrap;
                        self.$refs.canvasWrap.appendChild( container ); 
                    })

                    camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 1, 10000 );
                    camera.position.z = 1000;
                    scene = new THREE.Scene();
                    particles = new Array();
                    var PI2 = Math.PI * 2;
                    var material = new THREE.ParticleCanvasMaterial ( {
                        color: 0xe1e1e1,
                        program: function ( context ) {
                            context.beginPath();
                            context.arc( 0, 0, 0.6, 0, PI2, true );
                            context.fill();
                        }
                    } );
                    var i = 0;
                    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
                        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
                            particle = particles[ i ++ ] = new THREE.Particle( material );
                            particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                            particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                            scene.add( particle );
                        }
                    }
                    renderer = new THREE.CanvasRenderer();
                    console.log(window.innerWidth, window.innerHeight)
                    renderer.setSize( window.innerWidth, window.innerHeight );
                    container.appendChild( renderer.domElement );

                    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
                    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
                    //
                    window.addEventListener( 'resize', onWindowResize, false );
                }

                function onWindowResize() {
                    windowHalfX = window.innerWidth / 2;
                    windowHalfY = window.innerHeight / 2;
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize( window.innerWidth, window.innerHeight );
                }
                //
                function onDocumentMouseMove( event ) {
                    mouseX = event.clientX - windowHalfX;
                    mouseY = event.clientY - windowHalfY - 400;
                }
                function onDocumentTouchStart( event ) {
                    if ( event.touches.length === 1 ) {
                        event.preventDefault();
                        mouseX = event.touches[ 0 ].pageX - windowHalfX;
                        mouseY = event.touches[ 0 ].pageY - windowHalfY;
                    }
                }
                function onDocumentTouchMove( event ) {
                    if ( event.touches.length === 1 ) {
                        event.preventDefault();
                        mouseX = event.touches[ 0 ].pageX - windowHalfX;
                        mouseY = event.touches[ 0 ].pageY - windowHalfY;
                    }
                }
                //
                function animate() {
                    requestAnimationFrame( animate );
                    render();
                }
                function render() {
                    camera.position.x += ( mouseX - camera.position.x ) * .05;
                    camera.position.y += ( - mouseY - camera.position.y ) * .05;
                    camera.lookAt( scene.position );

                    var i = 0;
                    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
                        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
                            particle = particles[ i++ ];
                            particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                                ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                            particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
                                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
                        }
                    }
                    renderer.render( scene, camera );
                    count += 0.1;
                }
            },
            ...mapMutations({
                setToken: 'LOGIN', 
                setUsername: 'USERNAME'
            })
        },
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background: url('../../../assets/login_bg.png');
        background-color: #141a48;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -240px;
        text-align: center;
        font-size:34px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width: 380px;
        margin:-140px 0 0 -210px;
        padding:20px;
        text-align: center;
        border-radius: 5px;
        background: rgba(255, 255, 255, .8);
    }
    .ms-login.register {
   
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
    .canvas-wrap {
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        overflow: hidden;
    }
    
</style>