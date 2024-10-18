<script setup>
import pageContainer from '@/components/pageContainer.vue';
import { ref } from 'vue'
import { useUserStore } from '@/stores';
import { userUpdateInfoService } from '@/api/user'
const formRef = ref()
// 使用仓库中的初始值
const { user: { email, id, nickname, username }, getUser } = useUserStore()
const form = ref({
    username,
    nickname,
    email,
    id
});

const rules = {
    nickname: [
        { required: true, message: '昵称不能为空', trigger: 'blur' },
        { pattern: /^\S{2,10}/, message: '昵称长度在2到10个非空字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
    ],
};

const handleSubmit = async () => {
    // 等待校验结果
    await formRef.value.validate()
    // 调用 提交修改
    await userUpdateInfoService(form.value)
    // 通知user模块，对数据的更新
    getUser()
    // 提示成功
    ElMessage.success('修改成功')

};

</script>

<template>

    <pageContainer title="基本资料">
        <!-- 表单 -->
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="登录名称">
                <el-input v-model="form.username" disabled></el-input>
            </el-form-item>

            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入用户昵称"></el-input>
            </el-form-item>

            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交修改</el-button>
            </el-form-item>
        </el-form>
    </pageContainer>

</template>