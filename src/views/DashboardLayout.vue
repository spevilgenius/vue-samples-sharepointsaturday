<template>
  <b-container>
    <b-row class="m-0">
      <b-col md="12" class="p-0">
        <b-card no-body>
          <b-tabs ref="dashboardtabs" card v-model="tabIndex">
            <b-tab active>
              <template slot="title">
                <b-spinner type="border" small v-if="drawing"></b-spinner
                >Milestones OnTime By Year
              </template>
              <milestones-ontime-by-year />
            </b-tab>
            <b-tab title="Milestones OnTime By Month">
              <milestones-ontime-by-month />
            </b-tab>
            <b-tab title="Milestones Completed By Month">
              <milestones-completed-by-month />
            </b-tab>
            <b-tab title="Milestone Data">
              <milestones-data />
            </b-tab>
            <b-tab title="Milestone Grid">
              <milestones-grid />
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MilestonesOnTimeByYear from '@/components/MilestonesOnTimeByYear.vue'
import MilestonesOnTimeByMonth from '@/components/MilestonesOnTimeByMonth.vue'
import MilestonesCompletedByMonth from '@/components/MilestonesCompletedByMonth.vue'
import MilestonesData from '@/components/MilestonesData.vue'
import MilestonesGrid from '@/components/MilestonesGrid.vue'

export default {
  name: 'DashboardLayout',
  computed: {
    projectsloaded() {
      return this.$store.state.milestone.projectsloaded
    },
    projectsloading() {
      return this.$store.state.milestone.projectsloading
    },
    milestonesloaded() {
      return this.$store.state.milestone.loaded
    },
    milestonesloading() {
      return this.$store.state.milestone.loading
    },
    drawing() {
      return this.$store.state.milestone.drawing
    }
  },
  data: function() {
    return {
      isdev: false,
      tabIndex: 0
    }
  },
  updated: function() {
    console.log('DASHBOARD LAYOUT UPDATED')
/*     if (this.projectsloaded) {
      if (!this.milestonesloaded && !this.milestonesloading) {
        this.$store.dispatch('milestone/getMilestones')
        const notification = {
          type: 'info',
          message: 'Getting Milestones, please wait'
        }
        this.$store.dispatch('notification/add', notification, { root: true })
      }
    } */
  },
  mounted: function() {
    this.$nextTick(function() {
      if (this.projectsloading) {
        // set to false by default so we can set it once we start loading and then not keep doing it when the component changes
      } else if (!this.projectsloaded) {
        this.$store.dispatch('milestone/getProjects')
        // this.$store.dispatch('milestone/getMilestones')
        const notification = {
          type: 'info',
          message: 'Getting Projects, please wait'
        }
        this.$store.dispatch('notification/add', notification, { root: true })
      }
    })
  },
  components: {
    'milestones-ontime-by-year': MilestonesOnTimeByYear,
    'milestones-ontime-by-month': MilestonesOnTimeByMonth,
    'milestones-completed-by-month': MilestonesCompletedByMonth,
    'milestones-data': MilestonesData,
    'milestones-grid': MilestonesGrid
  }
}
</script>

<style scoped></style>
