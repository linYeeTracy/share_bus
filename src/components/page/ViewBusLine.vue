<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="班线id" sortable width="150"></el-table-column>
            <el-table-column prop="name" label="班线名称" width="120"></el-table-column>
            <el-table-column prop="carries" label="承运人" :formatter="formatter" width="120"></el-table-column>
            <el-table-column prop="carriesContact" label="承运人联系方式" sortable width="180"></el-table-column>
            <el-table-column prop="busType" label="车型/颜色" width="120"></el-table-column>
            <el-table-column prop="startTime" label="发车时间" :formatter="formatter" width="120"></el-table-column>
            <el-table-column prop="startStation" label="起始站点" sortable width="150"></el-table-column>
            <el-table-column prop="endStation" label="终止站点" width="120"></el-table-column>
            <el-table-column prop="stationNum" label="站点总数" :formatter="formatter" width="120"></el-table-column>

            <el-table-column label="站点" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看站点信息</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                // return self.tableData.filter(function(d){
                //     console.log(d)
                //     let is_del = false;
                //     for (let i = 0; i < self.del_list.length; i++) {
                //         if(d.name === self.del_list[i].name){
                //             is_del = true;
                //             break;
                //         }
                //     }
                //     if(!is_del){
                //         if(d.address.indexOf(self.select_cate) > -1 && 
                //             (d.name.indexOf(self.select_word) > -1 ||
                //             d.address.indexOf(self.select_word) > -1)
                //         ){
                //             return d;
                //         }
                //     }
                // })
                return self.tableData;
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    // self.url = '/ms/busline';
                    self.url = './static/vuetable.json';
                };
                self.$axios.get(self.url, {page:self.cur_page}).then((res) => {
                    console.log(res.data.list)
                    self.tableData = res.data.list;
                })
            },
            search(){
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>