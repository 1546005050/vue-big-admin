<script setup>
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores';
const isRegister = ref(false)
const form = ref()
// 整个用于提交的from的数据对象
const fromModel = ref({
    username: '',
    password: '',
    repassword: ''
})
// 整个表单的效验规则
// 1.非空校验 通过 required：ture  message消息提示 ，trigger触发效验时机
// 2.长度效验 min：xx  , max :xx
// 3.正则表达式 patter：正则表达式  \S非空字符
// 4.自定义校验=>自己写逻辑（函数）
// validaror:(rule, value,calback)
// 1)rule 当前校验规则相关的信息
// 2）value 所校验的表单元素目前的表单值
// 3）clallback 无论成功还是失败都需要callback回调
// -clallback()校验成功
// -callback(new error(错误信息))校验失败
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 10, message: '请输入5-10位字符的用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '请输入6-15位非空字符的密码', trigger: 'blur' }
    ],
    repassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '请输入6-15位非空字符的密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                // 判断value和当前form 中搜集的password是否一致
                if (value !== fromModel.value.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else
                    callback()//校验成功，也需要callback
            },
            trigger: 'blur'
        },
    ]
}
const register = async () => {
    // 注册成功之前，先进行校验，校验成功 =>请求，校验失败=>自动提示
    await form.value.validate()
    // console.log('开始注册请求');
    await userRegisterService(fromModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false
}

// 切换的时候，重置表单内容
watch(isRegister, () => {
    fromModel.value = {
        username: '',
        password: '',
        repassword: ''
    }
})
// 存token
const userStore = useUserStore()
const router = useRouter()
// 登录时预校验
const login = async () => {
    await form.value.validate()
    const res = await userLoginService(fromModel.value)
    console.log(res);

    userStore.setToken(res.data.token)
    ElMessage.success('登录成功')
    router.push('/')
}

</script>
<!-- 
1.结构相关
el-row表示一行，一行分成24分
el-col表示示例
1）：spand="12"代表在一行中占12份（50%）
2）：spand="6",代表在一行中占6份
3）：offset="3",代表在一行中，左侧magin份数 

el-from 整个表单
el-from-item 表单的一行（一个表单域）
el-input 表单元素（输入框）
2.校验相关
1)el-from=>：model="rulform"绑定的整个form的数据对象{xxx， xxx， xxx}
2)el-from=>:rules="rules"绑定的整个rules规则对象{xxx， xxx， xxx}
3)表单元素=> v-model='rules'给表单元素，绑定from的子属性
4)el-from-item =>prop配置生效的是哪个效验规则(和rules中的字段要对应)
-->
<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form :model="fromModel" :rules="rules" ref="form" size="large" autocomplete="off" v-if="isRegister">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="fromModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="fromModel.password" :prefix-icon="Lock" type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input v-model="fromModel.repassword" :prefix-icon="Lock" type="password"
                        placeholder="请输入再次密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="register" class="button" type="primary" auto-insert-space>
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form :model="fromModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="fromModel.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" v-model="fromModel.password" :prefix-icon="Lock" type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>