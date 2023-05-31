export default {
  modules: {
    zh: '模块管理',
    en: 'Modules Manage',
  },
  name: {
    zh: '模块名称',
    en: 'Name',
  },
  enable: {
    zh: '启用',
    en: 'Enable',
  },
  disable: {
    zh: '停用',
    en: 'Disable',
  },
  enabled: {
    zh: '已启用',
    en: 'Enabled',
  },
  disabled: {
    zh: '已停用',
    en: 'Disabled',
  },
  description: {
    zh: '描述',
    en: 'Description',
  },
  searchTip: {
    zh: '搜索模块...',
    en: 'Search modules...',
  },
  reconnect: {
    zh: '重连',
    en: 'Reconnect',
  },
  moduleEdit: {
    zh: '管理',
    en: 'Manage',
  },
  moduleAdd: {
    zh: '添加模块',
    en: 'Add Module',
  },
  moduleAddSuccess: {
    zh: '模块添加成功！',
    en: 'Module Add Successfully!',
  },
  moduleEditSuccess: {
    zh: '模块编辑成功！',
    en: 'Module Edit Successfully!',
  },
  added: {
    zh: '已添加',
    en: 'Added',
  },
  guide: {
    zh: '使用指引',
    en: 'Usage Guide',
  },
  readMore: {
    zh: '了解更多',
    en: 'Read More',
  },
  run: {
    zh: '运行',
    en: 'Run',
  },
  stop: {
    zh: '停止',
    en: 'Stop',
  },
  start: {
    zh: '启动',
    en: 'Start',
  },
  noData: {
    zh: '暂无数据',
    en: 'No data',
  },
  stopSuccess: {
    zh: '停止成功',
    en: 'Stop Success',
  },
  startSuccess: {
    zh: '开启成功',
    en: 'Start Success',
  },
  thisActionWillStopTheModule: {
    zh: '此操作将停止该模块,确认继续?',
    en: 'Confirm to stop the Module?',
  },
  thisActionWillDeleteTheModule: {
    zh: '此操作将删除该模块,确认继续?',
    en: 'Confirm to delete the Module?',
  },
  authentication: {
    zh: '认证鉴权',
    en: 'Authentication',
  },
  protocols: {
    zh: '协议接入',
    en: 'Protocols',
  },
  messagePublish: {
    zh: '消息下发',
    en: 'Message Publish',
  },
  extension: {
    zh: '多语言扩展',
    en: 'Extensions',
  },
  monitor: {
    zh: '运维监控',
    en: 'DevOps',
  },
  localModules: {
    zh: '内部模块',
    en: 'Local Modules',
  },
  configuration: {
    zh: '参数设置',
    en: 'Configuration',
  },
  listener: {
    zh: '监听器',
    en: 'Listeners',
  },
  addListener: {
    zh: '添加监听器',
    en: 'Add Listener',
  },
  editListener: {
    zh: '编辑监听器',
    en: 'Edit Listener',
  },
  remove: {
    zh: '移除',
    en: 'Remove',
  },
  listen_on: {
    zh: '监听地址',
    en: 'Listener',
  },
  listener_type: {
    zh: '监听类型',
    en: 'Listener Type',
  },
  acceptors: {
    zh: '接收器个数',
    en: 'Acceptors',
  },
  active_n: {
    zh: 'Active',
    en: 'Active',
  },
  max_conn_rate: {
    zh: '每秒最大连接数',
    en: 'Max CPS',
  },
  max_connections: {
    zh: '最大连接数',
    en: 'Max Connections',
  },
  emptyListenerTip: {
    zh: '请添加监听器！',
    en: 'Listener is required!',
  },
  fileTip: {
    zh: '请上传文件',
    en: 'Please upload File',
  },
  noNeedAddConfigTip: {
    zh: '此模块无需配置相关信息！',
    en: 'No configuration information is required for this module!',
  },
  continueCommit: {
    zh: '继续提交',
    en: 'Submit',
  },
  editTip: {
    zh: '应用更改将会短暂重启当前模块，可能会造成数据丢失或服务中断，请确保在不影响业务的情况下提交更改。',
    en: `
      Applying changes will immediately restart the current module which may cause data loss
      or service interruption. Please make sure to submit the changes without affecting the business.`,
  },
  auth: {
    zh: '认证',
    en: 'Authentication',
  },
  confirmDelete: {
    zh: '确认删除？',
    en: 'Confirm Delete?',
  },
  tabJwt: {
    zh: 'JWT工具',
    en: 'JWT Tools',
  },
  tabSasl: {
    zh: '认证信息',
    en: 'Authentication Info',
  },
  tabLwm2m: {
    zh: '客户端列表',
    en: 'Clients List',
  },
  tabTopic: {
    zh: '指标数据',
    en: 'Topic Metrics',
  },
  statistics: {
    zh: '慢订阅记录',
    en: 'Statistics',
  },
  clearData: {
    zh: '重置数据',
    en: 'Clear data',
  },
  timeoutTimes: {
    zh: '超时次数',
    en: 'Timeout times',
  },
  averageTime: {
    zh: '平均耗时',
    en: 'Mean Latency',
  },
  duration: {
    zh: '时长',
    en: 'Duration',
  },
  clearSlowSubscriptionConfirm: {
    zh: '清除当前所有数据并重新统计慢订阅',
    en: 'Clear current data and re-count slow subscription',
  },
  successfulCleanSlowSubscription: {
    zh: '清除成功',
    en: 'Cleared successfully',
  },
  listNull: {
    zh: '列表为空，请调整过滤条件再试',
    en: 'Empty. Please change the filter and try again',
  },
  allow: {
    zh: '允许',
    en: 'Allow',
  },
  deny: {
    zh: '不允许',
    en: 'Deny',
  },
  action: {
    zh: '主题动作',
    en: 'Action',
  },
  isAllow: {
    zh: '是否允许',
    en: 'Allowed',
  },
  useModulesTip: {
    zh: 'EMQX 提供了丰富的模块用于替换插件，建议您前往使用 <a href="/#/modules">模块</a>。',
    en: `EMQX provides a wealth of Modules to replace Plugin,
    it is recommended that you go to use <a href="/#/modules">Modules</a>.`,
  },
  searchClient: {
    zh: '请输入 IMEI',
    en: 'Please input IMEI',
  },
  enhancedAuth: {
    zh: '增强认证',
    en: 'Enhanced Auth',
  },
  mechanism: {
    zh: '认证机制',
    en: 'Authentication mechanism',
  },
  addAuth: {
    zh: '创建认证信息',
    en: 'Add Auth',
  },
  editAuth: {
    zh: '编辑认证信息',
    en: 'Edit Auth',
  },
  viewAuth: {
    zh: '查看认证信息',
    en: 'View Auth',
  },
  iterationCount: {
    zh: '迭代次数',
    en: 'Iteration Count',
  },
  iterationCountTip: {
    zh: '必须为正整数',
    en: 'Must be a positive integer',
  },
  serverKey: {
    zh: '服务密钥',
    en: 'Server key',
  },
  storedKey: {
    zh: '存储密钥',
    en: 'Stored key',
  },
  dataType: {
    zh: '数据类型',
    en: 'Data Type',
  },
  lwClientOffline: {
    zh: '当前客户端已下线',
    en: 'The current client is offline',
  },
  requestTimeout: {
    zh: '请求超时',
    en: 'Request timed out',
  },
  noConfig: {
    zh: '此模块无需配置参数',
    en: "The module doesn't need any configuration",
  },
  noConfigAdd: {
    zh: ',添加之后即可启用',
    en: ', you can use it after adding this module',
  },
  trace: {
    zh: 'Trace 记录',
    en: 'Trace Log',
  },
  messageBacklog: {
    zh: '消息堆积',
    en: 'Message backlog',
  },
  messageBacklogDesc: {
    zh: '消息一直处于超时情况下的超时时间',
    en: 'Message backlog timeout',
  },
  highAverageTime: {
    zh: '平均耗时较高',
    en: 'High average time',
  },
  highAverageTimeDesc: {
    zh: '消息传递平均时间超过预设阈值',
    en: 'The average message delivery time exceeds the setting',
  },
  latencyTime: {
    zh: '时延/堆积时长',
    en: 'Latency / Backlog Time',
  },
  updated: {
    zh: '更新时间',
    en: 'Updated',
  },
  fileInputPlaceholder: {
    zh: '粘贴或导入文件内容',
    en: 'Paste or import file contents',
  },
  confirmReplacement: {
    zh: '是否确认替换当前文件内容',
    en: 'Are you sure to replace the contents of the current file',
  },
  addACL: {
    zh: '添加 ACL',
    en: 'Add ACL',
  },
  createAuthentication: {
    zh: '添加认证',
    en: 'Add Authentication',
  },
  editAuthentication: {
    zh: '编辑认证',
    en: 'Edits Authentication',
  },
  onlySupportsExactSearch: {
    zh: '（只支持精确搜索）',
    en: '(Only supports exact search)',
  },
  defaultNodeTip: {
    zh: '已默认选中最新产生日志的节点，也可手动选择其他节点进行查看',
    en: 'The default selected node is the node which generated the log latest, or you can manually select another node to view the log',
  },
  topicCannotContain: {
    zh: '不能包含通配符',
    en: 'Cannot contain wildcards',
  },
  invalidSignature: {
    zh: '无效私钥',
    en: 'Invalid secret',
  },
  import: {
    zh: '导入',
    en: 'Import',
  },
  deviceId: {
    zh: '设备 ID',
    en: 'Device ID',
  },
  devicePublicKey: {
    zh: '设备公钥',
    en: 'Device Public Key',
  },
  devicePublicKeyTip: {
    zh: '添加至多 3 个用于对此设备进行身份验证的公钥',
    en: 'Add up to 3 public keys for authenticating this device',
  },
  addPubKey: {
    zh: '添加公钥',
    en: 'Add Public Key',
  },
  format: {
    zh: '格式',
    en: 'Format',
  },
  publicKey: {
    zh: '公钥',
    en: 'Public Key',
  },
  pubKeyFormat: {
    zh: '公钥格式',
    en: 'Public Key Format',
  },
  registry: {
    zh: '注册表',
    en: 'Registry',
  },
  region: {
    zh: '区域',
    en: 'Region',
  },
  project: {
    zh: '项目',
    en: 'Project',
  },
  addDevice: {
    zh: '添加设备',
    en: 'Add Device',
  },
  editDevice: {
    zh: '编辑设备',
    en: 'Edit Device',
  },
  deviceManagement: {
    zh: '设备管理',
    en: 'Devices',
  },
  importCompleted: {
    zh: '导入完成：成功 {suc}，失败 {failed}。',
    en: 'Import completed: {suc} succeeded, {failed} failed.',
  },
}
