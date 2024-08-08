<template>
  <div class="username-quota" :loading="isTableLoading">
    <el-table :data="tableData">
      <el-table-column prop="username" :label="$t('Clients.username')" />
      <el-table-column prop="used" :label="$t('Modules.numberOfSessions')" />
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
  </div>
</template>

<script>
import { queryUsernameQuotaUsage } from '@/api/modules'

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
  },
}
</script>
<style lang="scss">
.username-quota {
  padding: 28px 16px 16px;
}
</style>
