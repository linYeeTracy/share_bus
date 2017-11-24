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
                    <el-button size="small" @click="manageStaffInfo(scope.$index, scope.row, scope.store)">信息管理</el-button>
                    <el-button size="small" @click="manageBalance(scope.$index, scope.row, scope.store)">余额管理</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 余额管理 -->
        <el-dialog 
            title="余额管理"
            :visible.sync="balanceDialog"
            width="30%"
            :before-close="handleClose">
            公司账户余额：179900
            <el-form ref="balanceForm" :model="balanceForm" label-width="80px">
                <el-form-item label="发放金额">
                    <el-input v-model="balanceForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="balanceDialog = false">取 消</el-button>
                <el-button type="primary" @click="balanceDialog = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 员工信息修改 -->
        <el-dialog 
            title="员工信息修改"
            :visible.sync="staffDialog"
            width="30%"
            :before-close="handleClose">
            <el-form ref="form" :model="staffForm" label-width="80px">
                <el-form-item label="员工姓名">
                    <el-input v-model="staffForm.name"></el-input>
                </el-form-item>
                <el-form-item label="员工班线">
                    <el-input type="textarea" v-model="staffForm.busline"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="staffDialog = false">取 消</el-button>
                <el-button type="primary" @click="staffDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

    
</template>

<script>
    export default {
        data() {
            return {
                company_id: 'c_1',
                staffUrl: './static/staff.json',
                staffData: [],
                pageNo: 1,
                pageSize: 10,
                pageTotal: 10,
                multipleSelection: [],
                del_list: [],   
                // 对话框
                balanceDialog: false,
                staffDialog: false,
                staffForm: {},
                balanceForm: {}
            }
        },
        created(){
            this.getStaffData();
        },
        computed: {
 
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
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