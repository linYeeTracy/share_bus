<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 班线管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看班线</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="addBusLine">增加班线</el-button>
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delBusLine">删除班线</el-button>
            <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select> -->
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" 
            max-height="800"
            ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="班线id" sortable></el-table-column>
            <el-table-column prop="name" label="班线名称"></el-table-column>
            <el-table-column prop="carries" label="承运人" :formatter="formatter"></el-table-column>
            <el-table-column prop="carriesContact" label="承运人联系方式" sortable></el-table-column>
            <el-table-column prop="busType" label="车型/颜色"></el-table-column>
            <el-table-column prop="startTime" label="发车时间" :formatter="formatter"></el-table-column>
            <el-table-column prop="startStation" label="起始站点" sortable></el-table-column>
            <el-table-column prop="endStation" label="终止站点"></el-table-column>
            <el-table-column prop="stationNum" label="站点总数" :formatter="formatter"></el-table-column>

            <el-table-column label="站点" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="checkStations(scope.$index, scope.row, scope.store)">查看站点信息</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <el-table :data="station" border style="width: 100%" ref="stationTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="站点id" sortable></el-table-column>
            <el-table-column prop="name" label="站点名称"></el-table-column>
            <el-table-column prop="locDesc" label="站点描述"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="1000">
            </el-pagination>
        </div> -->

        <!-- 点击查看站点的弹出框 -->
        <el-dialog 
            title="查看站点"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-table :data="stationData" border style="width: 100%" ref="stationTable2">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="站点id" sortable></el-table-column>
                <el-table-column prop="name" label="站点名称"></el-table-column>
                <el-table-column prop="locDesc" label="站点描述"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

    
</template>

<script>
    export default {
        data() {
            return {
                lineUrl: './static/linetable.json',
                stationUrl: './static/stationtable.json',
                tableData: [],
                stationData: [],
                cur_page: 1,
                cur_pageSize: 10,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],   
                is_search: false,
                // 对话框
                dialogVisible: false
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
                    self.lineUrl = './static/linetable.json';
                };
                self.$axios.get(self.lineUrl, {page:self.cur_page, pageSize: self.cur_pageSize}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            getStationData(line_id) {
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.stationUrl = './static/stationtable.json';
                };
                this.$axios.get(self.stationUrl, {id: line_id}).then((res) => {
                    self.stationData = res.data.list; 
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
            checkStations(index, row, store) {
                this.dialogVisible = true;
                this.getStationData(row.id);
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            addBusLine() {
                this.$router.push({path:'/customBusLine'});
            },
            delBusLine(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];

                //
                this.$axios.get(self.lineUrl).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
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