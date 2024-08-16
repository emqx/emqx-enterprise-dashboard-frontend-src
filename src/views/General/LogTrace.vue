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
      <div class="app-wrapper">
        <a-card>
          <LogTraceTable />
        </a-card>
      </div>
    </template>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { loadAllModules, loadCreatedModules, updateModule } from '@/api/modules'
import { fillI18n } from '@/common/utils'
import LogTraceTable from '@/views/Modules/components/LogTrace/LogTrace.vue'

const LOG_MODULE_NAME = 'tracer'
const LOG_MODULE_ID = 'module:tracer'

export default {
  name: 'LogTrace',
  components: {
    LogTraceTable,
  },
  data() {
    return {
      isModuleAdded: false,
      isModuleEnabled: false,
      isEnabling: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
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
</style>
