<template>
  <div>CHART {{ milestone.milestonesTotal }}</div>
</template>

<script>
// import moment from 'moment'
// import Sortable from 'sortablejs'
import { mapState } from 'vuex'

var v = null
/* let isdev = false
let location = String(window.location)
if (location.indexOf('localhost') > 0) {
  isdev = true
} */

export default {
  name: 'MilestoneReportsTab',
  computed: {
    milestonesloaded() {
      return this.$store.state.milestone.loaded
    },
    milestonesloading() {
      return this.$store.state.milestone.loading
    },
    Milestones() {
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
      updated: 0
    }
  },
  init: function() {
    console.log('REPORTS INIT')
  },
  mounted: function() {
    console.log('REPORTS MOUNTED')
    v = this
  },
  updated: function() {
    this.updated += 1
    console.log('REPORTS UPDATED: ' + this.updated)
    // MOVE THIS TO SOMEHOW CHECK WHEN THE TAB IS LOADED
    if (this.milestonesloading) {
      // set to false by default so we can set it once we start loading and then not keep doing it when the component changes
    } else if (!this.milestonesloaded) {
      this.$store.dispatch('milestone/getMilestones')
      const notification = {
        type: 'info',
        message: 'Getting Milestones, please wait'
      }
      this.$store.dispatch('notification/add', notification, { root: true })
    }
  }
}
</script>

<style lang="scss" scoped></style>
