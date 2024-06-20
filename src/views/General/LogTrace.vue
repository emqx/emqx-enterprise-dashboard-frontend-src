<template>
  <div class="log-trace">
    <div v-if="!isModuleEnabled" class="no-log-tip">
      <img src="../../assets/img/trace_disabled.png" width="375" />
      <p>{{ $t('Modules.logTraceDesc') }}</p>
      <el-button size="small" class="confirm-btn" type="primary" :loading="isEnabling" @click="enableModule">
        {{ $t('Analysis.enable') }}
      </el-button>
    </div>
    <template v-else>
      <page-header>
        <div class="page-header-content-view">
          <div class="content">
            {{ $t('Modules.logTraceDesc') }}
          </div>
        </div>
      </page-header>
      <div class="app-wrapper" :loading="traceTbLoading">
        <a-card>
          <el-button size="small" :disabled="notAbleChange" @click="openCreateDialog" type="primary">
            {{ $t('Base.create') }}
          </el-button>
          <el-table :data="traceTable" v-loading="traceTbLoading" class="data-table">
            <el-table-column :label="$t('LogTrace.name')" prop="name"></el-table-column>
            <el-table-column :label="$t('LogTrace.type')" prop="type"></el-table-column>
            <el-table-column :label="$t('LogTrace.condition')">
              <template #default="{ row }">
                {{ row[row.type] }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('LogTrace.startEndTime')" min-width="90">
              <template #default="{ row }">
                {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}<br />{{
                  moment(row.end_at).format('YYYY-MM-DD HH:mm:ss')
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('LogTrace.status')">
              <template #default="{ row }">
                <a-badge
                  is-dot
                  :status="row.status === 'running' ? 'success' : row.status === 'stopped' ? 'default' : 'warning'"
                  :text="$t('LogTrace.s' + row.status)"
                ></a-badge>
              </template>
            </el-table-column>
            <el-table-column :label="$t('LogTrace.logSize')">
              <template #default="{ row }">
                {{ (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2) }}KB
              </template>
            </el-table-column>
            <el-table-column min-width="100">
              <template #default="{ row }">
                <el-button type="dashed" size="mini" @click="viewDetail(row)">
                  {{ $t('LogTrace.view') }}
                </el-button>
                <el-button type="dashed" size="mini" @click="download(row)" :loading="row.downloading">
                  {{ $t('LogTrace.download') }}
                </el-button>
                <template v-if="row.status !== 'stopped'">
                  <el-button size="mini" type="dashed" :disabled="notAbleChange" @click="stopTraceHandler(row)">
                    {{ $t('LogTrace.stop') }}
                  </el-button>
                </template>
                <template v-else>
                  <el-button size="mini" type="dashed" :disabled="notAbleChange" @click="deleteTraceHandler(row)">
                    {{ $t('LogTrace.delete') }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog :title="$t('LogTrace.createLog')" :visible.sync="createDialog">
            <el-form ref="createForm" size="small" label-position="top" :model="record" :rules="createRules">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('LogTrace.name')" prop="name">
                    <el-input v-model="record.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('LogTrace.type')" prop="type">
                    <el-select v-model="record.type">
                      <el-option
                        v-for="{ value, label } in typeOptions"
                        :key="value"
                        :value="value"
                        :label="label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="record.type === 'topic'">
                  <el-form-item label="Topic" prop="topic">
                    <el-input v-model="record.topic"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="record.type === 'clientid'">
                  <el-form-item label="ClientID" prop="clientid">
                    <el-input v-model="record.clientid"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="record.type === 'ip_address'">
                  <el-form-item label="IP Address" prop="ip_address">
                    <el-input v-model="record.ip_address"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="clear: both">
                  <el-form-item :label="$t('LogTrace.startEndTime')" prop="startTime">
                    <el-date-picker
                      type="datetimerange"
                      :start-placeholde="$t('LogTrace.startTime')"
                      :end-placeholde="$t('LogTrace.endTime')"
                      :picker-options="pickerOptions"
                      v-model="record.startTime"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="dialog-align-footer" slot="footer">
              <el-button size="small" @click="cancelDialog()">{{ $t('Base.cancel') }}</el-button>
              <el-button
                class="dialog-primary-btn"
                type="primary"
                size="small"
                :disabled="notAbleChange"
                @click="submitTrace()"
                :loading="createLoading"
              >
                {{ $t('Base.confirm') }}
              </el-button>
            </div>
          </el-dialog>
          <el-dialog :title="$t('LogTrace.viewLog')" :visible.sync="viewDialog" custom-class="log-dialog" fullscreen>
            <div v-loading="viewNodeLoading" :element-loading-text="nextPageLoading">
              <el-row>
                <el-col :span="6">
                  <el-select v-model="node" size="small">
                    <el-option v-for="item in nodes" :value="item.node" :key="item.node"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-button
                    class="dialog-primary-btn"
                    type="primary"
                    size="small"
                    @click="downloadInDetailPage"
                    :disabled="viewNodeLoading"
                    :loading="isDetailPageDownloading"
                  >
                    {{ $t('Base.download') }}
                  </el-button>
                </el-col>
              </el-row>
              <p class="default-node-tip">{{ $t('Modules.defaultNodeTip') }}</p>
              <el-row>
                <div :style="{ height: initialHeight + 'px' }" class="m-container" ref="monacoContainer">
                  <log-content
                    id="log-trace"
                    v-model="logContent"
                    :scroll-loading="true"
                    :scroll-func="scrollLoadFunc"
                    lang="powershell"
                    :disabled="true"
                  />
                </div>
              </el-row>
            </div>
          </el-dialog>
        </a-card>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash'
import {
  getTraceList,
  addTrace,
  getTraceLog,
  downloadTrace,
  stopTrace,
  deleteTrace,
  getTraceDetail,
} from '@/api/logTrace'
import LogContent from './components/LogContent.vue'
import { loadCreatedModules, updateModule, loadAllModules } from '@/api/modules'
import { fillI18n } from '@/common/utils'

const LOG_MODULE_NAME = 'tracer'
const LOG_MODULE_ID = 'module:tracer'

let LOG_VIEW_POSITION = 0
let LAST_ACTIVED_SCROLLTOP = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTEPERPAGE = 50 * 1024
const DEFAULT_DURATION = 30 * 60 * 1000

const typeOptions = [
  {
    value: 'clientid',
    label: 'ClientID',
  },
  {
    value: 'topic',
    label: 'Topic',
  },
  {
    value: 'ip_address',
    label: 'IP Address',
  },
]

export default {
  components: { LogContent },
  name: 'LogTrace',
  data() {
    const nameValidator = (rule, value, callback) => {
      if (/[\w-]+/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('General.validString')))
      }
    }
    const needStartTime = this.$t('LogTrace.needStartTime')
    // const needOnePacket = this.$t('LogTrace.needOnePacket')
    const pickerOptions = {
      disabledDate(date) {
        return date.getTime() < new Date(new Date().setHours(0)).getTime()
      },
    }
    return {
      isModuleAdded: false,
      isModuleEnabled: false,
      isEnabling: false,
      typeOptions,
      pickerOptions,
      traceTable: [],
      nodes: [],
      node: '',
      createDialog: false,
      viewDialog: false,
      createRules: {
        name: [
          { required: true, message: this.$t('General.pleaseEnter') },
          { validator: nameValidator, trigger: ['blur', 'change'] },
        ],
        topic: [{ required: true, message: this.$t('General.pleaseEnter') }],
        clientid: [{ required: true, message: this.$t('General.pleaseEnter') }],
        ip_address: [{ required: true, message: this.$t('General.pleaseEnter') }],
        startTime: [
          {
            validator(r, v, cb) {
              // eslint-disable-next-line no-unused-expressions
              v && v[0] && v[1] ? cb() : cb(new Error(needStartTime))
            },
          },
        ],
      },
      logContent: '',
      initialHeight: 350,
      createLoading: false,
      traceTbLoading: false,
      viewNodeLoading: false,
      isDetailPageDownloading: false,
      record: {
        name: '',
        type: typeOptions[0].value,
        clientid: '',
        ip_address: '',
        topic: '',
        startTime: [],
      },
      viewLogName: '',
      nextPageLoading: '',
      // Prevents monaco components from repeatedly triggering load events for unknown reasons
      isLoadedDataWithin300MS: false,
    }
  },
  created() {
    this.init()
  },
  watch: {
    node(v, oldV) {
      if (v && oldV && v !== oldV) this.viewDetail({ name: this.viewLogName }, true)
    },
  },
  methods: {
    moment,
    async confirmTraceEnabled() {
      try {
        const data = await loadCreatedModules()
        const moduleItem = data.find(({ id }) => id === LOG_MODULE_ID)
        this.isModuleAdded = !!moduleItem
        this.isModuleEnabled = moduleItem ? moduleItem.enabled : false
      } catch (error) {
        //
      }
    },
    async init() {
      try {
        this.isLoading = true
        await this.confirmTraceEnabled()
        if (this.isModuleEnabled) {
          this.loadTraceList()
        }
      } catch (error) {
        //
      } finally {
        this.isLoading = false
      }
    },
    parseI18n(val) {
      const data = fillI18n(val, ['title', 'description']).map((item) => {
        item.params = fillI18n(item.params, true)
        return item
      })
      return data
    },
    findModuleByName(moduleListMap, name) {
      let moduleItem
      Object.entries(moduleListMap).forEach(([, value]) => {
        value.forEach((item) => {
          if (item.name === name) {
            moduleItem = item
          }
        })
      })
      return moduleItem
    },
    async toModuleDetail() {
      const moduleListMap = await loadAllModules()
      const moduleItem = this.findModuleByName(moduleListMap, LOG_MODULE_NAME)
      if (!moduleItem) {
        return
      }
      const data = cloneDeep(moduleItem)
      this.parseI18n([data])
      const { params } = data
      const selectedModule = {
        paramsData: params,
        type: moduleItem.name,
        oper: 'add',
        title: moduleItem.title,
        description: moduleItem.description,
      }
      this.$store.dispatch('UPDATE_MODULE', selectedModule)

      this.$router.push({ name: 'module-detail', query: { backTo: 'trace' } })
    },
    async enableModule() {
      try {
        this.isEnabling = true
        if (!this.isModuleAdded) {
          await this.toModuleDetail()
        } else {
          await updateModule(LOG_MODULE_ID, { enabled: true })
          this.init()
        }
      } catch (error) {
        //
      } finally {
        this.isEnabling = false
      }
    },
    async loadNodes(name) {
      try {
        this.nodes = []
        this.nodes = await getTraceDetail(name)
      } catch (error) {
        //
      }
    },
    async loadTraceList() {
      this.traceTbLoading = true
      // this.fTraceTbLoading = true
      try {
        const traceList = await getTraceList()
        this.traceTable = traceList.map((item) => ({ ...item, downloading: false }))
        // this.fTraceTb = traceList[1]
        // this.fTraceTbLoading = false
      } catch (error) {
        //
      } finally {
        this.traceTbLoading = false
      }
    },

    async submitTrace() {
      this.$refs.createForm.validate(async (valid) => {
        if (!valid) return

        this.createLoading = true
        const { clientid, ip_address, name, topic, type } = this.record
        let targetInfo = {}
        switch (type) {
          case typeOptions[0].value:
            targetInfo = { clientid, type }
            break
          case typeOptions[1].value:
            targetInfo = { topic, type }
            break
          case typeOptions[2].value:
            targetInfo = { ip_address, type }
            break
          default:
            break
        }
        const sendbody = {
          name,
          ...targetInfo,
          start_at: new Date(this.record.startTime[0]).toISOString(),
          end_at: new Date(this.record.startTime[1]).toISOString(),
        }

        delete sendbody.startTime
        const res = await addTrace(sendbody).catch(() => {})
        if (res) {
          this.$message.success(this.$t('LogTrace.createSuc'))
          this.loadTraceList()
          this.cancelDialog()
        }
        this.createLoading = false
      })
    },
    async openCreateDialog() {
      this.createDialog = true
      const timeNow = new Date()
      this.record.startTime = [timeNow, new Date(timeNow.getTime() + DEFAULT_DURATION)]
    },
    getWhichNodeHasNewestLog() {
      const nodeList = this.nodes
      if (!nodeList || nodeList.length === 0) {
        return ''
      }
      return nodeList.sort((node1, node2) => node2.mtime - node1.mtime)[0].node
    },
    initLogContent() {
      LOG_VIEW_POSITION = 0
      LAST_ACTIVED_SCROLLTOP = 0
      this.logContent = ''
      this.nextPageLoading = ''
    },
    async viewDetail(row, changeNode = false) {
      if (!row || !row.name) return
      this.viewDialog = true
      this.isDetailPageDownloading = false
      this.$nextTick(() => {
        this.countInitialHeight()
      })
      this.viewNodeLoading = true
      this.viewLogName = row.name

      this.initLogContent()

      if (!changeNode) {
        await this.loadNodes(this.viewLogName)
        this.node = this.getWhichNodeHasNewestLog(row.name)
      }
      await this.loadLogDetail(row.name)

      this.viewNodeLoading = false
    },
    async loadLogDetail(name) {
      if (this.isLoadedDataWithin300MS) {
        return
      }
      this.isLoadedDataWithin300MS = true
      window.setTimeout(() => {
        this.isLoadedDataWithin300MS = false
      }, 300)

      const params = { position: LOG_VIEW_POSITION, bytes: BYTEPERPAGE, node: this.node }
      const logResp = await getTraceLog(name, params).catch(() => {})
      if (logResp && logResp.items) {
        const { meta = {} } = logResp
        this.logContent += logResp.items
        LOG_VIEW_POSITION = meta.position ? meta.position : LOG_VIEW_POSITION + BYTEPERPAGE
      }
    },
    async download(row) {
      if (!row.name) {
        return
      }
      try {
        row.downloading = true
        await downloadTrace(row.name)
      } catch (error) {
        //
      } finally {
        row.downloading = false
      }
    },
    async downloadInDetailPage() {
      if (!this.viewLogName) {
        return
      }
      try {
        this.isDetailPageDownloading = true
        await downloadTrace(this.viewLogName)
      } catch (error) {
        //
      } finally {
        this.isDetailPageDownloading = false
      }
    },
    async stopTraceHandler(row) {
      if (!row.name) return
      const res = await stopTrace(row.name).catch(() => {})
      if (res) {
        this.$message.success(this.$t('LogTrace.stopSuc'))
        this.loadTraceList()
      }
    },
    async scrollLoadFunc(event) {
      if (
        event.scrollTop + this.initialHeight >= event.scrollHeight &&
        event.scrollTopChanged &&
        event.scrollTop >= LAST_ACTIVED_SCROLLTOP
      ) {
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
          LAST_ACTIVED_SCROLLTOP = event.scrollTop
          this.viewNodeLoading = true
          this.nextPageLoading = this.$t('LogTrace.loadNextPage')
          await this.loadLogDetail(this.viewLogName)
          this.viewNodeLoading = false
        } else {
          this.$messages.warning(this.$t('LogTrace.tooLargeLog'))
        }
      }
    },
    async deleteTraceHandler(row) {
      if (!row.name) {
        return
      }
      const prompt = await this.$confirm(this.$t('LogTrace.confirmDeleteTrace'), {
        confirmButtonText: this.$t('Base.confirm'),
        cancelButtonText: this.$t('Base.cancel'),
        type: 'warning',
      }).catch(() => {})

      if (prompt) {
        const res = await deleteTrace(row.name).catch(() => {})
        if (res) {
          this.$message.success(this.$t('LogTrace.deleteSuc'))
          this.loadTraceList()
        }
      }
    },
    countInitialHeight() {
      const windowHeight = window.innerHeight
      const containerTop = this.$refs.monacoContainer.getBoundingClientRect().top
      this.initialHeight = windowHeight - containerTop - 50
    },
    cancelDialog() {
      this.createDialog = false
      this.$refs.createForm.resetFields()
    },
    cancelViewDialog() {
      this.viewDialog = false
    },
  },
  beforeRouteLeave(to, from, next) {
    this.viewDialog = false
    next()
  },
}
</script>

<style lang="scss" scoped>
.no-log-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding-top: 160px;
  img {
    margin-bottom: 20px;
  }
  p {
    width: 360px;
    margin-bottom: 20px;
  }
  .confirm-btn {
    width: 100px;
  }
}
.data-table {
  margin-top: 30px;
}
.el-select {
  width: 100%;
}
.el-date-editor {
  width: 100% !important;
}
.packet-chkbox {
  line-height: 18px;
}
.m-container {
  border: 1px solid #ddd;
  margin-top: 30px;
}

.el-button.el-button--small {
  line-height: 14px;
}

.default-node-tip {
  margin-bottom: 0;
  margin-top: 8px;
  color: #bcbcbc;
}
</style>
