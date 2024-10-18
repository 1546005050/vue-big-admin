<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artAddService, artGetDetailService, artEditServce } from '@/api/article'
import axios from 'axios';
import { baseURL } from '@/utils/request';
import { ElMessage } from 'element-plus';
const visibleDrawer = ref(false)
// 默认数据
const defaultForm = {
    title: '',//标题
    cate_id: '',//分类id
    cover_img: '',//封面图片
    content: '',//string 内容
    state: ''//状态
}
// 图片上传
const imgUrl = ref('')
const onUploadFile = (uploadFile) => {
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    formModel.value.cover_img = uploadFile.raw
}
//提供数据
const formModel = ref({ ...defaultForm })


// open对外暴露方法
const editorRef = ref()
const open = async (row) => {
    visibleDrawer.value = true
    if (row.id) {
        // 需要基于row.id发送请求，获取编辑对应的详情数据
        const res = await artGetDetailService(row.id)
        formModel.value = res.data.data
        // 单独处理图片
        imgUrl.value = baseURL + formModel.value.cover_img
        const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)

        // 提交给后台的格式是file对象格式
        formModel.value.cover_img = file
    } else {
        formModel.value = { ...defaultForm }//基于默认数据重置form 数据
        imgUrl.value = ''
        nextTick(() => { editorRef.value.setHTML('') })
    }
}

defineExpose({
    open
})
// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
    formModel.value.state = state
    // 注意：当前接口，需要的是formdata
    // 将普通对象=>转换成=>formData对象
    const fd = new FormData()
    for (let key in formModel.value) {
        fd.append(key, formModel.value[key])
    }
    // 发请求
    if (formModel.value.id) {
        // 编辑
        await artEditServce(fd)
        ElMessage.success('修改成功')
        visibleDrawer.value = false
        emit('success', 'edit')
    } else {
        // 添加
        await artAddService(fd)
        ElMessage.success('添加成功')
        visibleDrawer.value = false
        // 通知到父组件，添加成功
        emit('success', 'add')
    }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
    try {
        // 第一步：使用axios获取网络图片数据
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageData = response.data;

        // 第二步：将图片数据转换为Blob对象
        const blob = new Blob([imageData], { type: response.headers['content-type'] });

        // 第三步：创建一个新的File对象
        const file = new File([blob], fileName, { type: blob.type });

        return file;
    } catch (error) {
        console.error('将图片转换为File对象时发生错误:', error);
        throw error;
    }
}
</script>

<template>
    <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
        <!-- 发表文章表单 -->
        <el-form :model="formModel" ref="formRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
                <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
                <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false"
                    :on-change="onUploadFile">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div class="editor">
                    <quill-editor ref="editorRef" theme="snow" v-model:content="formModel.content" contentType="html">
                    </quill-editor>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
                <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>