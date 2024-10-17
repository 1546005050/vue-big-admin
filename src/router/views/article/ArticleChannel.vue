<script setup>
import { articleChannelServce, artDelChannelServece } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue';
import { ElMessageBox } from 'element-plus';
const dialog = ref()
const loading = ref(false)
const channelList = ref([])

const onDelChannel = async (row) => {
    await ElMessageBox.confirm('你去扔要删除嘛', '温馨提示',
        {
            type: 'warning',
            confirmButtonText: '确认按钮',
            cancelButtonText: '取消'
        })
    await artDelChannelServece(row.id)
    ElMessage.success('删除成功')
    getChannelList()
}
const getChannelList = async () => {
    loading.value = true
    const res = await articleChannelServce()
    channelList.value = res.data.data
    loading.value = false

}
getChannelList()

const onEditChannel = (row) => {
    dialog.value.open(row)
}
const onAddChannel = () => {
    dialog.value.open({})
}
const onSuccess = () => {
    getChannelList()
}
</script>


<template>
    <page-container title="文章分类">
        <template #extra>
            <el-button @click="onAddChannel" type="primary"> 添加分类 </el-button>
        </template>
        <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
        <el-table v-loading="loading" :data="channelList" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="cate_name"></el-table-column>
            <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
            <el-table-column label="操作" width="150">
                <!-- row 就是 channelList的一项，$index 下标 -->
                <template #default="{ row, $index }">
                    <el-button :icon="Edit" round small plain type="primary"
                        @click="onEditChannel(row, $index)"></el-button>
                    <el-button :icon="Delete" round small plain type="danger"
                        @click="onDelChannel(row, $index)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>



    </page-container>
</template>