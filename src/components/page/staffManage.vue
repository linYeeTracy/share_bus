<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 乘车管理</el-breadcrumb-item>
                <el-breadcrumb-item>员工管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="add" class="handle-del mr10" @click="addStaff">增加</el-button>
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delStaff">删除</el-button>
            
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="staffData" border style="width: 100%" 
            max-height="800"
            ref="staffTable">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="工号"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="department" label="部门"></el-table-column>
            <el-table-column prop="contact" label="联系方式"></el-table-column>
            <el-table-column prop="busline" label="班线"></el-table-column>
            <el-table-column prop="balance" label="余额"></el-table-column>

            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="recharge(scope.$index, scope.row, scope.store)">信息修改</el-button>
                    <el-button size="small" @click="managebalance(scope.$index, scope.row, scope.store)">余额管理</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 点击查看站点的弹出框 -->
        <!-- <el-dialog 
            title="余额管理"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-table :data="stationData" border style="width: 100%" ref="banlanceTable">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="id" label="站点id" sortable></el-table-column>
                <el-table-column prop="name" label="站点名称"></el-table-column>
                <el-table-column prop="locDesc" label="站点描述"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>

    
</template>

<script>
    export default {
        data() {
            return {
                company_id: 'c_1',
                staffUrl: './static/staff.json',
                staffData: [],
                cur_page: 1,
                cur_pageSize: 10,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],   
                is_search: false,
                // 对话框
                balanceDialogVisible: false
            }
        },
        created(){
            this.getStaffData();
        },
        computed: {
            // staffData(){
            //     const self = this;
            //     // return self.tableData.filter(function(d){
            //     //     console.log(d)
            //     //     let is_del = false;
            //     //     for (let i = 0; i < self.del_list.length; i++) {
            //     //         if(d.name === self.del_list[i].name){
            //     //             is_del = true;
            //     //             break;
            //     //         }
            //     //     }
            //     //     if(!is_del){
            //     //         if(d.address.indexOf(self.select_cate) > -1 && 
            //     //             (d.name.indexOf(self.select_word) > -1 ||
            //     //             d.address.indexOf(self.select_word) > -1)
            //     //         ){
            //     //             return d;
            //     //         }
            //     //     }
            //     // })
            //     if(process.env.NODE_ENV === 'development'){
            //         self.staffUrl = './static/staff.json';
            //     };
            //     this.$axios.get(self.staffUrl, {company: this.company_id}).then((res) => {
            //         return res.data.list; 
            //     })
            // }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            // getData(){
            //     let self = this;
            //     if(process.env.NODE_ENV === 'development'){
            //         // self.url = '/ms/busline';
            //         self.lineUrl = './static/linetable.json';
            //     };
            //     self.$axios.get(self.lineUrl, {page:self.cur_page, pageSize: self.cur_pageSize}).then((res) => {
            //         self.tableData = res.data.list;
            //     })
            // },
            getStaffData(line_id) {
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.staffUrl = './static/staff.json';
                };
                this.$axios.get(self.staffUrl, {id: line_id}).then((res) => {
                    self.staffData = res.data.list; 
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
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            addStaff() {},
            delStaff() {}
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