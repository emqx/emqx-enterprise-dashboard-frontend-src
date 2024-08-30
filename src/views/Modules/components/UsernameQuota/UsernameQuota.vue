<template>
  <div class="username-quota" :loading="isTableLoading">
    <div class="emq-table-header">
      <el-row class="search-bar" :gutter="20">
        <el-col :span="8">
          <el-input v-model="filter" size="small" :placeholder="$t('Clients.clientId')" @keyup.enter.native="search" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="search">
            {{ $t('Base.search') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="username" :label="$t('Clients.username')" />
      <el-table-column prop="used" :label="$t('Modules.numberOfSessions')">
        <template slot-scope="{ row }">
          {{ row.used }}
          <el-button size="mini" @click="viewDetail(row)">{{ $t('Overview.view') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <el-pagination
        hide-on-single-page
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[20, 50, 100, 500]"
        :page-size.sync="params._limit"
        :current-page.sync="params._page"
        :total="params._count"
        @size-change="handleSizeChange"
        @current-change="getData"
      >
      </el-pagination>
    </div>
    <el-dialog :title="$t('Modules.tabLwm2m')" width="520px" :visible.sync="showDetailDialog">
      <el-table :data="currentView" class="data-list">
        <el-table-column prop="clientid" min-width="130px" :label="$t('Clients.clientId')">
          <template slot-scope="{ row }">
            <router-link
              :to="{
                path: '/clients/detail',
                query: { clientid: row },
              }"
              class="keep-spaces"
              target
              >{{ row }}</router-link
            >
            <i v-clipboard:cpoy="row" v-clipboard:success="copySucceed" class="icon-copy el-icon-copy-document"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { queryUsernameQuotaUsage, searchUsernameQuotaUsage } from '@/api/modules'

export default {
  name: 'SlowQuery',
  data() {
    return {
      tableData: [],
      params: {
        _page: 1,
        _limit: 20,
        _count: 0,
      },
      isTableLoading: false,

      filter: '',

      showDetailDialog: false,
      currentView: [],
    }
  },

  created() {
    this.getData()
  },

  methods: {
    async getData() {
      try {
        this.isTableLoading = true
        const { items, meta } = await queryUsernameQuotaUsage(this.params)
        this.tableData = items
        this.params._count = meta.count
      } catch (error) {
        //
      } finally {
        this.isTableLoading = false
      }
    },
    handleSizeChange() {
      this.params._page = 1
      this.getData()
    },
    async search() {
      try {
        if (!this.filter) {
          this.getData()
          return
        }
        this.params._page = 1
        const data = await searchUsernameQuotaUsage(this.filter)
        this.tableData = [data]
      } catch (error) {
        this.tableData = []
      }
    },
    viewDetail(data) {
      this.currentView = data.clientids || []
      this.showDetailDialog = true
    },
    copySucceed() {
      this.$message.success(this.$t('Base.copied'))
    },
  },
}
</script>
<style lang="scss">
.username-quota {
  padding: 28px 16px 16px;
  .search-bar {
    width: 100%;
    .el-button {
      height: 32px;
    }
  }
  .el-table {
    .el-button {
      margin-left: 12px;
    }
  }
  .icon-copy {
    margin-left: 12px;
    cursor: pointer;
  }
  .el-table__row {
    .icon-copy {
      display: none;
    }
    &:hover {
      .icon-copy {
        display: inline-block;
      }
    }
  }
}
</style>
