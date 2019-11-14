<template>
  <b-container fluid>
    <b-row>
      <vue-highcharts
        class="chart"
        :options="chartOptions"
        ref="columnCharts"
        :highcharts="Highcharts"
      ></vue-highcharts>
    </b-row>
    <b-row>
      <b-dropdown id="dd-filter-year" text="FiscalYear">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-years"
            class="cbgmanagers"
            :options="years"
            v-model="ffYears"
            name="Years"
            stacked
            @input="filterme('year', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-dept" text="Dept">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-depts"
            class="cbgmanagers"
            :options="depts"
            v-model="ffDept"
            name="Depts"
            stacked
            @input="filterme('dept', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-div" text="Div">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-divs"
            class="cbgmanagers"
            :options="divs"
            v-model="ffDiv"
            name="Divs"
            stacked
            @input="filterme('div', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-pjm" text="PjM Code">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-pjms"
            class="cbgmanagers"
            :options="pjms"
            v-model="ffPjM"
            name="Pjms"
            stacked
            @input="filterme('pjm', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-level" text="Project Level">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-levels"
            class="cbgmanagers"
            :options="levels"
            v-model="ffLevels"
            name="Levels"
            stacked
            @input="filterme('level', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-title" text="Project Title">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-titles"
            class="cbgmanagers"
            :options="titles"
            v-model="ffTitles"
            name="Titles"
            stacked
            @input="filterme('title', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-dropdown id="dd-filter-manager" text="Project Manager">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="cbg-filter-managers"
            class="cbgmanagers"
            :options="managers"
            v-model="ffManagers"
            name="Managers"
            stacked
            @input="filterme('manager', null)"
          ></b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
    </b-row>
  </b-container>
</template>

<script>
import VueHighcharts from 'vue2-highcharts'
import Exporting from 'highcharts/modules/exporting'
// import ExportingData from 'highcharts/modules/export-data'
import Highcharts from 'highcharts'
import moment from 'moment'
// import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import { setInterval, clearInterval } from 'timers'

Exporting(Highcharts)
// ExportingData(Highcharts)

var v = null

export default {
  components: {
    VueHighcharts
  },
  name: 'MilestonesOnTimeByYear',
  computed: {
    projectsloaded() {
      return this.$store.state.milestone.projectsloaded
    },
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
    allmilestones() {
      return this.$store.state.milestone.allmilestones
    },
    managers() {
      return this.$store.state.milestone.filters.managers
    },
    depts() {
      return this.$store.state.milestone.filters.depts
    },
    divs() {
      return this.$store.state.milestone.filters.divs
    },
    pjms() {
      return this.$store.state.milestone.filters.pjms
    },
    levels() {
      return this.$store.state.milestone.filters.levels
    },
    titles() {
      return this.$store.state.milestone.filters.titles
    },
    years() {
      return this.$store.state.milestone.filters.years
    },
    ...mapState(['milestone'])
  },
  data: function() {
    return {
      Highcharts: Highcharts,
      title: 'Chart',
      chartdata: [],
      chartOptions: {
        colors: ['blue', 'red', 'purple', 'green'],
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'column',
          width: 1200,
          height: 600,
          alignTicks: false
        },
        /* exporting: {
          buttons: {
            contextButton: {
              enabled: true
            }
          }
        }, */
        legend: {
          align: 'right',
          verticalAlign: 'top',
          layout: 'vertical',
          x: 0,
          y: 150
        },
        title: {
          text: 'On Time Milestones Index by Fiscal Year'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        xAxis: {
          categories: []
        },
        yAxis: [
          {
            labels: {
              format: '{value}',
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            },
            title: {
              text: 'Milestones',
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            },
            gridLineWidth: 0
          },
          {
            min: 0,
            max: 100,
            tickInterval: 10,
            labels: {
              format: '{value}%',
              style: {
                color: Highcharts.getOptions().colors[1]
              }
            },
            opposite: true
          }
        ],
        plotOptions: {
          column: {
            allowPointSelect: true,
            cursor: 'pointer',
            pointPadding: 0.2,
            borderWidth: 0
            /* dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}',
              style: {
                color:
                  (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                  'black'
              }
            } */
          },
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: ({ point }) => {
                  this.showtable(point.name)
                }
              }
            }
          }
        },
        series: []
      },
      chartdrawn: false,
      filtered: false,
      filteredmilestones: [], // will hold all the milestones at first and then holds the filtered milestones
      ffYears: [], // used for filtering
      ffDept: [], // used for filtering
      ffDiv: [], // used for filtering
      ffPjM: [], // used for filtering
      ffLevels: [], // used for filtering
      ffTitles: [], // used for filtering
      ffManagers: [], // used for filtering
      updated: 0
    }
  },
  init: function() {
    console.log('MilestonesOnTimeByYear INIT')
    this.filtered = this.milestones // set filtered on init to all milestones. The filtering function will filter this value
    this.buildChart()
  },
  mounted: function() {
    console.log('MilestonesOnTimeByYear MOUNTED')
    v = this
    this.$options.interval = setInterval(this.getMilestones, 1000)
  },
  updated: function() {
    this.updated += 1
    console.log('MilestonesOnTimeByYear UPDATED: ' + this.updated)
    if (this.milestonesloaded && !this.chartdrawn) {
      this.buildChart()
    }
  },
  methods: {
    showtable(name) {
      alert(name)
    },
    getMilestones: function() {
      if (this.projectsloaded) {
        if (!this.milestonesloaded && !this.milestonesloading) {
          // clear the interval and get the milestones
          clearInterval(this.$options.interval)
          this.$store.dispatch('milestone/getMilestones')
          const notification = {
            type: 'info',
            message: 'Getting Milestones, please wait'
          }
          this.$store.dispatch('notification/add', notification, { root: true })
        }
      }
    },
    filterme: function(f) {

    },
    buildChart: function() {
      // use the milestone data to create the series
      // loop through the fiscal years selection and build the data for each series
      var Charts = this.$refs.columnCharts
      if (!this.filtered) {
        this.filteredmilestones = this.allmilestones
        this.filtered = true
      }
      var p = this.filteredmilestones
      // get all unique FYS into a simple array first
      var years = []
      for (var i = 0; i < p.length; i++) {
        if (years.indexOf(p[i].FY) < 0) {
          years.push(p[i].FY)
        }
      }
      for (i = 0; i < years.length; i++) {
        // build out the data to draw the series based on the fiscal years
        this.chartdata.push({
          FY: years[i],
          total: 0,
          ot: 0,
          c: 0,
          dpi: 0
        })
      }
      console.log('CHARTDATA LENGTH:' + this.chartdata.length)
      for (i = 0; i < this.chartdata.length; i++) {
        var fy = this.chartdata[i].FY
        for (var j = 0; j < p.length; j++) {
          if (p[j].FY === fy) {
            // add the totals for the milestone counts
            this.chartdata[i].total += 1
            if (moment(p[j].mdaf).isValid()) {
              this.chartdata[i].c += 1
              // was it on time?
              var af = moment(p[j].mdaf)
              if (p[j].mdpf !== null || p[j].mdpf !== '') {
                var pf = moment(p[j].mdpf)
                if (pf.isSameOrAfter(af)) {
                  this.chartdata[i].ot += 1
                  this.chartdata[i].dpi =
                    (this.chartdata[i].ot / this.chartdata[i].total) * 100
                }
              }
            }
          }
        }
      }
      for (i = 0; i < this.chartdata.length; i++) {
        // now create the categories
        this.chartOptions.xAxis.categories.push("FY" + this.chartdata[i].FY)
      }
      var total = []
      var ontime = []
      var comp = []
      var dpi = []
      for (i = 0; i < this.chartdata.length; i++) {
        total.push(this.chartdata[i].total)
        ontime.push(this.chartdata[i].ot)
        comp.push(this.chartdata[i].c)
        dpi.push(this.chartdata[i].dpi)
      }
      Charts.addSeries({
        name: 'Total # Milestones Due',
        data: total
      })
      Charts.addSeries({
        name: 'Completed On Time',
        data: ontime
      })
      Charts.addSeries({
        name: 'Completed',
        data: comp
      })
      Charts.addSeries({
        name: 'DPI',
        type: 'line',
        yAxis: 1,
        data: dpi
      })
      this.$store.dispatch('milestone/setDrawing', false)
      this.$store.dispatch('milestone/setDrawn', true)
    }
  },
  beforeDestroy() {
    clearInterval(this.$options.interval)
  }
}
</script>

<style lang="scss" scoped></style>
