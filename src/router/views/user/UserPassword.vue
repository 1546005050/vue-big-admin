<script setup>
import { ref } from 'vue'
import { userUpdatePassService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus' // 确保引入 ElMessage

const formRef = ref()
const router = useRouter()
const userStore = useUserStore()

const pwdForm = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

const checkOldSame = (rule, value, cb) => {
    if (value === pwdForm.value.old_pwd) {
        cb(new Error('原密码和新密码不能一样!'))
    } else {
        cb()
    }
}

const checkNewSame = (rule, value, cb) => {
    if (value !== pwdForm.value.new_pwd) {
        cb(new Error('新密码和确认密码不一致!'))
    } else {
        cb()
    }
}

const rules = {
    old_pwd: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
        }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
        },
        { validator: checkOldSame, trigger: 'blur' }
    ],
    re_pwd: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            pattern: /^\S{6,15}$/,
            message: '密码长度必须是6-15位的非空字符串',
            trigger: 'blur'
        },
        { validator: checkNewSame, trigger: 'blur' }
    ]
}

const onSubmit = async () => {
    try {
        await formRef.value.validate()
        await userUpdatePassService(pwdForm.value)
        ElMessage.success('密码修改成功!')

        // 清除用户信息并重定向
        userStore.setToken('')
        userStore.setUser('')
        router.push('/login')
    } catch (error) {
        console.error('密码修改失败:', error)
    }
}

const onReset = () => {
    pwdForm.value = {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
    }
}
</script>

<template>
    <page-container title="重置密码">
        <el-row>
            <el-col :span="12">
                <el-form :model="pwdForm" :rules="rules" ref="formRef" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="re_pwd">
                        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onSubmit" type="primary">修改密码</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </page-container>
</template>
