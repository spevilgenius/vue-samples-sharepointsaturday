<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="px-0">
        <b-button
          variant="success"
          right
          size="sm"
          class="smallbutton"
          @click="exportme()"
          title="Show Milestones"
          >Export To Excel</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" class="px-0">
        <b-form>
          <b-table
            id="MilestonesDataTable"
            :ref="MilestonesDataTable"
            v-model="shownData"
            responsive
            :striped="striped"
            :bordered="bordered"
            :small="small"
            :hover="hover"
            :sort-by.sync="sortby"
            :items="milestones"
            :fields="fields"
            :primary-key="ID"
          >
          </b-table>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MilestonesData',
  computed: {
    milestonesloaded() {
      return this.$store.state.milestone.loaded
    },
    milestonesloading() {
      return this.$store.state.milestone.loading
    },
    milestones() {
      return this.$store.state.milestone.milestones
    },
    milestonecount() {
      return this.$store.state.milestone.milestonesTotal
    },
    ...mapState(['milestone'])
  },
  data: function() {
    return {
      title: 'Chart',
      updated: 0,
      fields: [
        /* { key: 'actions', label: 'Action', thClass: 'text-center px40' }, */
        {
          key: 'erpid',
          label: 'ERPID',
          thClass: 'text-center px40'
        },
        { key: 'ptitle', label: 'Project Title' },
        { key: 'dept', label: 'Dept', thClass: 'text-center' },
        { key: 'div', label: 'Div', thClass: 'text-center' },
        { key: 'pjm', label: 'PjM', thClass: 'text-center' },
        { key: 'level', label: 'Level', thClass: 'text-center' },
        { key: 'manager', label: 'Manager', thClass: 'text-center' },
        { key: 'title', label: 'Milestone Title', thClass: 'text-center' },
        { key: 'FY', label: 'FY', thClass: 'text-center' },
        {
          key: 'mdps',
          label: 'Planned Start',
          thClass: 'text-center msheader px80'
        },
        {
          key: 'mdpf',
          label: 'Planned Finish',
          thClass: 'text-center msheader px80'
        },
        {
          key: 'mdas',
          label: 'Actual Start',
          thClass: 'text-center msheader px80'
        },
        {
          key: 'mdaf',
          label: 'Actual Finish',
          thClass: 'text-center msheader px80'
        },
        {
          key: 'status',
          label: 'Milestone Status',
          thClass: 'text-center px120'
        }
      ],
      striped: true,
      bordered: true,
      outlined: true,
      small: true,
      hover: true,
      dark: false,
      fixed: false,
      footClone: false,
      shownData: []
    }
  },
  init: function() {
    console.log('MilestonesData INIT')
  },
  mounted: function() {
    console.log('MilestonesData MOUNTED')
  },
  updated: function() {
    this.updated += 1
    console.log('MilestonesData UPDATED: ' + this.updated)
    // MOVE THIS TO SOMEHOW CHECK WHEN THE TAB IS LOADED
    if (this.milestonesloading) {
      // draw the chart
    }
  },
  methods: {
    exportme: function() {
      $('#MilestonesDataTable').tableExport({
        type: 'excel',
        escape: 'false'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
