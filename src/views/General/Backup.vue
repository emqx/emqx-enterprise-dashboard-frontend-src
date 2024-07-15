<template>
  <div class="backup">
    <page-header>
      <div class="page-header-content-view">
        <div class="content">
          {{ $t('Backup.manageDashboardBackup') }}
        </div>
      </div>
    </page-header>

    <div class="app-wrapper">
      <a-card class="emq-list-card">
        <div class="emq-table-header">
          <el-button type="primary" size="small" icon="el-icon-plus" :disabled="notAbleChange" @click="handleExport">
            {{ $t('Backup.createBackup') }}
          </el-button>
          <el-upload
            ref="upload"
            class="upload-backup"
            action="/api/v4/data/file"
            accept=".json"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="handleChange"
            :on-error="handleError"
            :disabled="notAbleChange"
          >
            <el-button slot="trigger" size="small" icon="el-icon-upload2" :disabled="notAbleChange">
              {{ $t('Backup.uploadServer') }}
            </el-button>
          </el-upload>
        </div>

        <el-table :data="tableData" class="data-list">
          <el-table-column prop="node" :label="$t('RuleEngine.node')"></el-table-column>
          <el-table-column prop="filename" :label="$t('Backup.filename')"></el-table-column>
          <el-table-column prop="size" :label="$t('Backup.size')">
            <template slot-scope="{ row }">
              {{ row.size | renderSize }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="$t('Backup.createAt')"></el-table-column>
          <el-table-column width="250px">
            <template slot-scope="{ row, $index }">
              <el-button type="dashed" size="mini" @click="handleDownload(row)">{{ $t('Backup.download') }} </el-button>
              <el-button
                type="dashed"
                size="mini"
                :disabled="notAbleChange"
                :loading="rowLoadingStatus[$index]"
                @click="handleRestore(row, $index)"
              >
                {{ $t('Backup.restore') }}
              </el-button>
              <el-button type="dashed danger" size="mini" :disabled="notAbleChange" @click="deleteConfirm(row)">
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import { isUndefined } from 'lodash'
import { loadBackup, exportBackup, deleteBackup, downloadFile, importBackup, uploadBackupFile } from '@/api/backup'

export default {
  name: 'Backup',

  components: {},

  filters: {
    renderSize(val) {
      if (val === null || val === '') {
        return '0 Bytes'
      }
      const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let index = 0
      const srcsize = parseFloat(val)
      index = Math.floor(Math.log(srcsize) / Math.log(1024))
      let size = srcsize / 1024 ** index
      size = size.toFixed(1)
      return `${size} ${unitArr[index]}`
    },
  },

  props: {},

  data() {
    return {
      fileList: [],
      tableData: [],
      rowLoadingStatus: {},
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.tableData = await loadBackup()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject()
      }
    },
    async handleExport() {
      const res = await exportBackup()
      if (res) {
        this.$message.success(this.$t('Base.createSuccess'))
        this.loadData()
      }
    },
    async handleDownload(row) {
      const res = await downloadFile(row.filename)
      if (res) {
        const aTag = document.createElement('a')
        const blob = new Blob([res.file])
        aTag.download = row.filename
        aTag.href = URL.createObjectURL(blob)
        aTag.setAttribute('type', 'hidden')
        document.body.appendChild(aTag)
        aTag.click()
        aTag.remove()
        URL.revokeObjectURL(blob)
      }
    },
    setLoadingStatus(index, value) {
      if (!isUndefined(index)) {
        this.$set(this.rowLoadingStatus, index, value)
      }
    },
    async handleRestore(row, index) {
      try {
        this.setLoadingStatus(index, true)
        const { filename, node } = row
        const res = await importBackup({ filename, node })
        if (res) {
          this.$message.success(this.$t('Backup.restoreSuccess'))
        }
      } catch (error) {
        //
      } finally {
        this.setLoadingStatus(index, false)
      }
    },
    deleteConfirm(row) {
      const vue = this
      this.$msgbox
        .confirm(this.$t('Backup.confirmDelete'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        .then(async () => {
          deleteBackup(row.filename).then(() => {
            vue.$message.success(this.$t('Base.deleteSuccess'))
            vue.loadData()
          })
        })
        .catch(() => {})
    },
    handleChange(file) {
      if (file.size >= 5242880) {
        this.$message.warning(this.$t('Backup.fileTooBig'))
        this.$refs.upload.clearFiles()
        return
      }
      const reader = new FileReader()
      reader.readAsText(file.raw)
      reader.onload = async (event) => {
        const content = event.currentTarget.result
        const uploadData = {
          file: content,
          filename: file.name,
        }
        const res = await uploadBackupFile(uploadData)
        const { node } = res.data
        if (res) {
          await this.loadData()
          const rowIndex = this.tableData.findIndex((item) => item.node === node && item.filename === file.name)
          this.handleRestore({ filename: file.name, node }, rowIndex)
          this.$refs.upload.clearFiles()
        }
      }
      reader.onerror = () => {
        this.$message.error(this.$t('Backup.uploadFailed'))
      }
    },
    handleError(error) {
      this.$message.error(error.toString())
    },
  },
}
</script>

<style lang="scss">
.backup {
  .el-table {
    margin-bottom: 40px;
  }
  .upload-backup {
    text-align: right;
  }
}
</style>
