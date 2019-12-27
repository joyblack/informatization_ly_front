import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/login'
import Main from './views/Main/index'
import Home from './views/Home/index'


// *生产管理* //
//基础资料
import Tunnelling from './views/Production/BasicData/Tunnelling/Tunnelling'
import TunnellingList from './views/Production/BasicData/Tunnelling/List/TunnellingList'
import Extraction from './views/Production/BasicData/Extraction/Extraction'
import ExtractionList from './views/Production/BasicData/Extraction/List/ExtractionList'
import Drilling from './views/Production/BasicData/Drilling/Drilling'
import DrillingList from './views/Production/BasicData/Drilling/List/DrillingList'
import DrillingAnalysis from './views/Production/BasicData/Drilling/DrillingAnalysis/DrillingAnalysis'
//生产日报
import DailyTunnelling from './views/Production/DailyProduction/DailyTunnelling/DailyTunnelling'
import DailyTunnellingList from './views/Production/DailyProduction/DailyTunnelling/List/DailyTunnellingList'
import DailyExtraction from './views/Production/DailyProduction/DailyExtraction/DailyExtraction'
import DailyExtractionList from './views/Production/DailyProduction/DailyExtraction/List/DailyExtractionList'
import DailyDrilling from './views/Production/DailyProduction/DailyDrilling/DailyDrilling'
import DailyDrillingList from './views/Production/DailyProduction/DailyDrilling/List/DailyDrillingList'
import DailyDrainage from './views/Production/DailyProduction/DailyDrainage/DailyDrainage'
import DailyDrainageList from './views/Production/DailyProduction/DailyDrainage/List/DailyDrainageList'
import DailyColliery from './views/Production/DailyProduction/DailyColliery/DailyColliery'
import DailyCollieryList from './views/Production/DailyProduction/DailyColliery/List/DailyCollieryList'


// *安全管理* //
import Inspection from './views/Security/Inspection/Inspection'
import InspectionList from './views/Security/Inspection/List/InspectionList'
import BreakRules from './views/Security/BreakRules/BreakRules'
import BreakRulesList from './views/Security/BreakRules/List/BreakRulesList'


// 物资管理
import IntoStorage from './views/Material/IntoStorage/IntoStorage'
import IntoStorageList from './views/Material/IntoStorage/List/IntoStorageList'
import CancelDataList from './views/Material/IntoStorage/Edit/CancelDataList'
import IntoStorageAdd from './views/Material/IntoStorage/Edit/IntoStorageAdd'
import OutStorage from './views/Material/OutStorage/OutStorage'
import OutStorageList from './views/Material/OutStorage/List/OutStorageList'
import OutStorageAdd from './views/Material/OutStorage/Edit/OutStorageAdd'
import InventoryStatistics from './views/Material/InventoryStatistics/InventoryStatistics'
import InventoryStatisticsList from './views/Material/InventoryStatistics/List/InventoryStatisticsList'
import ClassMaterials from './views/Material/ClassMaterials/ClassMaterials'
import ClassMaterialsList from './views/Material/ClassMaterials/List/ClassMaterialsList'
import Warehouse from './views/Material/Warehouse/Warehouse'
import WarehouseList from './views/Material/Warehouse/List/WarehouseList'
import WarehouseEdit from './views/Material/Warehouse/Edit/WarehouseEdit'


// *设备管理* //
import Equipments from './views/Equipment/Equipments/Equipments'
import EquipmentsList from './views/Equipment/Equipments/List/EquipmentsList'


// *资料管理* //
import BasicInfo from './views/Datas/BasicInfo/BasicInfo'
import BasicInfoList from './views/Datas/BasicInfo/List/BasicInfoList'
import Licence from './views/Datas/Licence/Licence'
import LicenceList from './views/Datas/Licence/List/LicenceList'


// *培训管理* //
import Record from './views/Train/Record/Record'
import RecordList from './views/Train/Record/List/RecordList'


// *人事管理* //
import Entry from './views/Personnel/Entry/Entry'
import EntryList from './views/Personnel/Entry/List/EntryList'
import Leave from './views/Personnel/Leave/Leave'
import LeaveList from './views/Personnel/Leave/List/LeaveList'
import PositionManage from './views/Personnel/PositionManage/PositionManage'
import PositionManageList from './views/Personnel/PositionManage/List/PositionManageList'


// *设置* //
import User from './views/SetUp/User/User'
import UserList from './views/SetUp/User/List/UserList'
import Department from './views/SetUp/Department/Department'
import DepartmentList from './views/SetUp/Department/List/DepartmentList'
import Resource from './views/SetUp/Resource/Resource'
import ResourceList from './views/SetUp/Resource/List/ResourceList'
import RoleManage from './views/SetUp/RoleManage/RoleManage'
import RoleManageList from './views/SetUp/RoleManage/List/RoleManageList'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            redirect: '/home',
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: Home
                },
                //生产管理-基础资料-掘进工作面
                {
                    path: '/production/basicData/tunnelling',
                    name: 'tunnelling',
                    component: Tunnelling,
                    redirect: '/production/basicData/tunnelling/list',
                    children: [{
                        path: 'list',
                        name: 'tunnellingList',
                        component: TunnellingList
                    }]
                },
                //生产管理-基础资料-回采工作面
                {
                    path: '/production/basicData/extraction',
                    name: 'extraction',
                    component: Extraction,
                    redirect: '/production/basicData/extraction/list',
                    children: [{
                        path: 'list',
                        name: 'extractionList',
                        component: ExtractionList
                    }]
                },
                //生产管理-基础资料-打孔工作
                {
                    path: '/production/basicData/drilling',
                    name: 'drilling',
                    component: Drilling,
                    redirect: '/production/basicData/drilling/list',
                    children: [{
                        path: 'list',
                        name: 'drillingList',
                        component: DrillingList
                    },{
                        path:'edit',
                        name:'drillingAnalysis',
                        component:DrillingAnalysis
                    }]
                },
                //生产管理-生产日报-掘进日报
                {
                    path: '/production/dailyProduction/dailyTunnelling',
                    name: 'dailyTunnelling',
                    component: DailyTunnelling,
                    redirect: '/production/dailyProduction/dailyTunnelling/list',
                    children: [{
                        path: 'list',
                        name: 'dailyTunnellingList',
                        component: DailyTunnellingList
                    }]
                },
                //生产管理-生产日报-回采日报
                {
                    path: '/production/dailyProduction/dailyExtraction',
                    name: 'dailyExtraction',
                    component: DailyExtraction,
                    redirect: '/production/dailyProduction/dailyExtraction/list',
                    children: [{
                        path: 'list',
                        name: 'dailyExtractionList',
                        component: DailyExtractionList
                    }]
                },
                //生产管理-生产日报-打孔日报
                {
                    path: '/production/dailyProduction/dailyDrilling',
                    name: 'dailyDrilling',
                    component: DailyDrilling,
                    redirect: '/production/dailyProduction/dailyDrilling/list',
                    children: [{
                        path: 'list',
                        name: 'dailyDrillingList',
                        component: DailyDrillingList
                    }]
                },
                //生产管理-生产日报-抽放日报
                {
                    path: '/production/dailyProduction/dailyDrainage',
                    name: 'dailyDrainage',
                    component: DailyDrainage,
                    redirect: '/production/dailyProduction/dailyDrainage/list',
                    children: [{
                        path: 'list',
                        name: 'dailyDrainageList',
                        component: DailyDrainageList
                    }]
                },
                //生产管理-生产日报-煤矿生产日报
                {
                    path: '/production/dailyProduction/dailyColliery',
                    name: 'dailyColliery',
                    component: DailyColliery,
                    redirect: '/production/dailyProduction/dailyColliery/list',
                    children: [{
                        path: 'list',
                        name: 'dailyCollieryList',
                        component: DailyCollieryList
                    }]
                },
                //安全管理-安全巡检
                {
                    path: '/security/inspection',
                    name: 'inspection',
                    component: Inspection,
                    redirect: '/security/inspection/list',
                    children: [{
                        path: 'list',
                        name: 'inspectionList',
                        component: InspectionList
                    }]
                },
                //安全管理-三违管理
                {
                    path: '/security/breakRules',
                    name: 'breakRules',
                    component: BreakRules,
                    redirect: '/security/breakRules/list',
                    children: [{
                        path: 'list',
                        name: 'breakRulesList',
                        component: BreakRulesList
                    }]
                },
                //物资管理-入库管理
                {
                    path: '/material/into-storage',
                    name: 'intoStorage',
                    component: IntoStorage,
                    redirect: '/material/into-storage/list',
                    children: [
                        {
                            path: 'list',
                            name: 'intoStorageList',
                            component: IntoStorageList
                        },
                        {
                            path: 'cancel',
                            name: 'cancelDataList',
                            component: CancelDataList
                        },
                        {
                            path: 'add',
                            name: 'intoStorageAdd',
                            component: IntoStorageAdd
                        }                        
                    ]
                },
                //物资管理-出库管理
                {
                    path: '/material/out-storage',
                    name: 'outStorage',
                    component: OutStorage,
                    redirect: '/material/out-storage/list',
                    children: [
                        {
                            path: 'list',
                            name: 'outStorageList',
                            component: OutStorageList
                        },
                        {
                            path: 'add',
                            name: 'outStorageAdd',
                            component: OutStorageAdd
                        }
                    ]
                },
                //物资管理-库存统计
                {
                    path: '/material/inventory-statistics',
                    name: 'inventoryStatistics',
                    component: InventoryStatistics,
                    redirect: '/material/inventory-statistics/list',
                    children: [{
                        path: 'list',
                        name: 'inventoryStatisticsList',
                        component: InventoryStatisticsList
                    }]
                },
                //物资管理-材料分类
                {
                    path: '/material/class-materials',
                    name: 'classMaterials',
                    component: ClassMaterials,
                    redirect: '/material/class-materials/list',
                    children: [{
                        path: 'list',
                        name: 'classMaterialsList',
                        component: ClassMaterialsList
                    }]
                },

                //物资管理-仓库信息
                {
                    path: '/material/warehouse',
                    name: 'warehouse',
                    component: Warehouse,
                    redirect: '/material/warehouse/list',
                    children: [{
                        path: 'list',
                        name: 'warehouseList',
                        component: WarehouseList
                    },{
                        path:'edit',
                        name:'warehouseEdit',
                        component:WarehouseEdit
                    }]
                },
                //设备管理-设备列表
                {
                    path: '/equipment/equipments',
                    name: 'equipments',
                    component: Equipments,
                    redirect: '/equipment/equipments/list',
                    children: [{
                        path: 'list',
                        name: 'equipmentsList',
                        component: EquipmentsList
                    }]
                },
                //资料管理-基本信息
                {
                    path: '/datas/basicInfo',
                    name: 'basicInfo',
                    component: BasicInfo,
                    redirect: '/datas/basicInfo/list',
                    children: [{
                        path: 'list',
                        name: 'basicInfoList',
                        component: BasicInfoList
                    }]
                },
                //资料管理-证照信息
                {
                    path: '/datas/licence',
                    name: 'licence',
                    component: Licence,
                    redirect: '/datas/licence/list',
                    children: [{
                        path: 'list',
                        name: 'licenceList',
                        component: LicenceList
                    }]
                },
                //培训管理-培训记录
                {
                    path: '/train/record',
                    name: 'record',
                    component: Record,
                    redirect: '/train/record/list',
                    children: [{
                        path: 'list',
                        name: 'recordList',
                        component: RecordList
                    }]
                },
                //人事管理-入职管理
                {
                    path: '/personnel/entry',
                    name: 'entry',
                    component: Entry,
                    redirect: '/personnel/entry/list',
                    children: [{
                        path: 'list',
                        name: 'entryList',
                        component: EntryList
                    }]
                },
                //人事管理-离职管理
                {
                    path: '/personnel/leave',
                    name: 'leave',
                    component: Leave,
                    redirect: '/personnel/leave/list',
                    children: [{
                        path: 'list',
                        name: 'leaveList',
                        component: LeaveList
                    }]
                },
                //人事管理-职务管理
                {
                    path: '/personnel/positionManage',
                    name: 'positionManage',
                    component: PositionManage,
                    redirect: '/personnel/positionManage/list',
                    children: [{
                        path: 'list',
                        name: 'positionManageList',
                        component: PositionManageList
                    }]
                },
                //用户管理
                {
                    path: '/setUp/User',
                    name: 'user',
                    component: User,
                    redirect: '/setUp/User/list',
                    children: [{
                        path: 'list',
                        name: 'userList',
                        component: UserList
                    }]
                },
                //部门管理
                {
                    path: '/setUp/Department',
                    name: 'department',
                    component: Department,
                    redirect: '/setUp/Department/list',
                    children: [{
                        path: 'list',
                        name: 'departmentList',
                        component: DepartmentList
                    }]
                },
                //Resource 资源管理
                {
                    path: '/setUp/Resource',
                    name: 'resource',
                    component: Resource,
                    redirect: '/setUp/Resource/list',
                    children: [{
                        path: 'list',
                        name: 'resourceList',
                        component: ResourceList
                    }]
                },
                //设置-角色管理
                {
                    path: '/setUp/roleManage',
                    name: 'roleManage',
                    component: RoleManage,
                    redirect: '/setUp/roleManage/list',
                    children: [{
                        path: 'list',
                        name: 'roleManageList',
                        component: RoleManageList
                    }]
                }
            ],
        },
        //登录
        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ]
})
