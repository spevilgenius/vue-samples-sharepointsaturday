/* eslint-disable */
import ProjectService from '@/services/ProjectService.js'
import MilestoneService from '@/services/MilestoneService.js'
import UtilityService from '@/services/UtilityService.js'
import moment from 'moment'

export const namespaced = true

let location = String(window.location)
let isdev = false

if (location.indexOf('localhost') >= 0) {
  isdev = true
}

function predicateBy(prop) {
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1
    } else if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  }
}

export const state = {
  projects: [],
  project: {},
  projectsTotal: 0,
  milestones: [],
  allmilestones: [],
  sorted: [],
  milestone: {},
  milestonesTotal: 0,
  projectsloaded: false,
  projectsloading: false,
  loaded: false,
  loading: false,
  drawn: false,
  drawing: true,
  filters: {
    managers: [],
    depts: [],
    divs: [],
    pjms: [],
    titles: [],
    levels: [],
    years: [],
    months: [
      '10',
      '11',
      '12',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09'
    ]
  }
}

export const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
    console.log('Projects added to store')
  },
  SET_PROJECTS_TOTAL(state, pt) {
    console.log(pt + ' projects found.')
    state.projectsTotal = pt
  },
  SET_MILESTONES(state, milestones) {
    state.milestones = milestones
    console.log(milestones.length + ' Milestones added to store')
  },
  SET_ALL_MILESTONES(state, milestones) {
    state.allmilestones = milestones
  },
  SET_MILESTONES_TOTAL(state, pt) {
    state.milestonesTotal = pt
  },
  SET_DRAWN(state, drawn) {
    state.drawn = drawn
  },
  SET_DRAWING(state, drawing) {
    state.drawing = drawing
  },
  SET_LOADED(state, loaded) {
    state.loaded = loaded
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_PROJECTS_LOADED(state, loaded) {
    state.projectsloaded = loaded
  },
  SET_PROJECTS_LOADING(state, loading) {
    state.projectsloading = loading
  },
  SET_SORTED(state, sorted) {
    state.sorted = sorted
  },
  SET_FILTERS(state, filters) {
    state.filters.managers = filters.managers
    state.filters.depts = filters.depts
    state.filters.divs = filters.divs
    state.filters.pjms = filters.pjms
    state.filters.titles = filters.titles
    state.filters.levels = filters.levels
  },
  SET_YEARS(state, years) {
    state.filters.years = years
  },
  SET_MONTHS(state, months) {
    state.filters.months = months
  }
}

export const actions = {
  getProjects({ commit, dispatch }) {
    console.log('Calling Project Service')
    commit('SET_PROJECTS_LOADING', true)
    ProjectService.getProjects()
      .then(response => {
        let isdev = false
        let location = String(window.location)
        if (location.indexOf('localhost') > 0) {
          isdev = true
        }
        if (isdev) {
          commit('SET_PROJECTS_TOTAL', parseInt(response.data.length))
          commit('SET_PROJECTS', response.data)
          commit('SET_FILTERS', getProjectFilters(response.data))
          commit('SET_PROJECTS_LOADED', true)
          commit('SET_PROJECTS_LOADING', false)
        } else {
          commit('SET_PROJECTS_TOTAL', parseInt(response.length))
          commit('SET_PROJECTS', formatProjects(response))
          commit('SET_FILTERS', getProjectFilters(response))
          commit('SET_PROJECTS_LOADED', true)
          commit('SET_PROJECTS_LOADING', false)
        }
      })
      .catch(error => {
        console.log(
          'Milestone Store--There was an error getting projects : ',
          error
        )
      })
  },
  getMilestones({ state, commit }) {
    // This will not be loaded until projects are loaded so that we can merge the data into the milestones array
    console.log('Calling Milestone Service')
    commit('SET_LOADING', true)
    MilestoneService.getMilestones()
      .then(response => {
        // Service already formats DEV but DEV has a different response type so the return is slightly different
        let isdev = false
        let location = String(window.location)
        if (location.indexOf('localhost') > 0) {
          isdev = true
        }
        if (isdev) {
          var m = formatMilestones(response.data) // format the response from the service to match desired json format
          commit('SET_MILESTONES_TOTAL', parseInt(response.data.length))
          commit('SET_MILESTONES', m)
          commit('SET_ALL_MILESTONES', m)
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        } else {
          // SharePoint
          var m = formatMilestones(response) // format the response from the service to match desired json format
          commit('SET_MILESTONES_TOTAL', parseInt(response.length))
          commit('SET_MILESTONES', m)
          commit('SET_ALL_MILESTONES', m)
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        }
      })
      .catch(error => {
        // TODO: Let the user know!!
        console.log(
          'Milestone Store--There was an error getting milestones: ',
          error
        )
      })
  },
  setDrawn({ commit }, drawn) {
    commit('SET_DRAWN', drawn)
  },
  setDrawing({ commit }, drawing) {
    commit('SET_DRAWING', drawing)
  }
}

export const getters = {
  getMilestones(state) {
    return state.milestones
  }
}

function formatProjects(j) {
  var p = []
  // just loop and create the array with better keys
  if (isdev) {
    // add to p array just in case additions are needed later
    for (var i = 0; i < j.length; i++) {
      p.push(j[i])
    }
  } else {
    for (var i = 0; i < j.length; i++) {
      if (
        (j[i]['Title'] !== null || j[i]['Title'] !== '') &&
        j[i]['DeliverableMilestonesEditRecord']['Title'] === 'Y'
      ) {
        p.push({
          erpid: j[i]['Title'],
          title: j[i]['ProjectTitle'],
          id: j[i]['Id'],
          dept: j[i]['DeptText'],
          div: j[i]['PjMCode']['Div'],
          pjm: j[i]['PjMCode']['Branch'],
          level: j[i]['ProjectLevelShort'],
          manager: j[i]['PM']['Title']
        })
      }
    }
  }
  return p
}

function getProjectFilters(j) {
  var filters = {
    // years is done in the milestones because the projects don't have the fiscal year
    depts: [],
    divs: [],
    pjms: [],
    levels: [],
    titles: [],
    managers: []
  }
  if (isdev) {
    // dev already formated the keys so we have to do the same as prod but with different values
    for (var i = 0; i < j.length; i++) {
      if (filters.managers.indexOf(j[i].manager) >= 0) {
      } else {
        filters.managers.push(j[i].manager)
      }
      if (filters.depts.indexOf(j[i].dept) >= 0) {
      } else {
        filters.depts.push(j[i].dept)
      }
      if (filters.divs.indexOf(j[i].div) >= 0) {
      } else {
        filters.divs.push(j[i].div)
      }
      if (filters.pjms.indexOf(j[i].pjm) >= 0) {
      } else {
        filters.pjms.push(j[i].pjm)
      }
      if (filters.titles.indexOf(j[i].title) >= 0) {
      } else {
        filters.titles.push(j[i].title)
      }
      if (filters.levels.indexOf(j[i].level) >= 0) {
      } else {
        filters.levels.push(j[i].level)
      }
    }
  } else {
    for (var i = 0; i < j.length; i++) {
      if (filters.managers.indexOf(j[i]['PM']['Title']) >= 0) {
      } else {
        filters.managers.push(j[i]['PM']['Title'])
      }
      if (filters.depts.indexOf(j[i]['DeptText']) >= 0) {
      } else {
        filters.depts.push(j[i]['DeptText'])
      }
      if (filters.divs.indexOf(j[i]['PjMCode']['Div']) >= 0) {
      } else {
        filters.divs.push(j[i]['PjMCode']['Div'])
      }
      if (filters.pjms.indexOf(j[i]['PjMCode']['Branch']) >= 0) {
      } else {
        filters.pjms.push(j[i]['PjMCode']['Branch'])
      }
      if (filters.titles.indexOf(j[i]['ProjectTitle']) >= 0) {
      } else {
        filters.titles.push(j[i]['ProjectTitle'])
      }
      if (filters.levels.indexOf(j[i]['ProjectLevelShort']) >= 0) {
      } else {
        filters.levels.push(j[i]['ProjectLevelShort'])
      }
    }
  }
  filters.managers.sort()
  filters.depts.sort()
  filters.divs.sort()
  filters.pjms.sort()
  filters.titles.sort()
  filters.levels.sort()
  return filters
}

function buildMilestone(title, erpid, length) {
  let M = {
    _rowVariant: '',
    index: 0,
    guid: Math.uuid(),
    id: 0,
    erpid: erpid,
    ptitle: '',
    dept: '',
    div: '',
    pjm: '',
    level: '',
    manager: '',
    title: title,
    FY: '',
    month: '',
    mdps: '',
    mdpf: '',
    mdas: '',
    mdaf: '',
    status: ''
  }
  return M
}

function formatMilestones(j) {
  var p = []
  // just loop and create the array with better keys
  for (var i = 0; i < j.length; i++) {
    var m = null,
      prj = null,
      fy = null,
      goon = true
    if (isdev) {
      prj = state.projects.filter(project => project.erpid === j[i].erpid)
      if (prj.length <= 0) {
        console.log('NO PROJECT EXISTS FOR ERPID: ' + j[i].erpid)
        goon = false
      }
    } else {
      prj = state.projects.filter(project => project.erpid === j[i]['ERPID'])
      if (prj.length <= 0) {
        console.log('NO PROJECT EXISTS FOR ERPID: ' + j[i]['ERPID'])
        goon = false
      }
    }
    // no check if there is a planned finish
    if (isdev) {
      fy = j[i].FY
    } else {
      fy = j[i]['FiscalYear']
    }
    if (goon === true && typeof fy === 'string') {
      // There must be a planned finish
      if (isdev) {
        m = buildMilestone(j[i].title, j[i].erpid, i)
      } else {
        m = buildMilestone(j[i]['MilestoneTitle'], j[i]['ERPID'], i)
      }
      m.index = i
      m.id = isdev ? j[i].id : j[i]['ID']
      // m.order = i + 1
      m.ptitle = prj[0].title
      m.dept = prj[0].dept
      m.div = prj[0].div
      m.pjm = prj[0].pjm
      m.level = prj[0].level
      m.manager = prj[0].manager
      m.FY = isdev ? j[i].FY : j[i]['FiscalYear']
      if (state.filters.years.indexOf(m.FY) < 0) {
        state.filters.years.push(m.FY)
      }
      var pf = null
      if (!isdev) {
        m.mdps = moment(j[i]['PlannedStart']).isValid()
          ? moment(j[i]['PlannedStart']).format('MM/DD/YYYY')
          : ''
        m.mdpf = moment(j[i]['PlannedFinish']).isValid()
          ? moment(j[i]['PlannedFinish']).format('MM/DD/YYYY')
          : ''
        m.mdas = moment(j[i]['ActualStart']).isValid()
          ? moment(j[i]['ActualStart']).format('MM/DD/YYYY')
          : ''
        m.mdaf = moment(j[i]['ActualFinish']).isValid()
          ? moment(j[i]['ActualFinish']).format('MM/DD/YYYY')
          : ''
      } else {
        m.mdps = j[i].mdps
        m.mdpf = j[i].mdpf
        m.mdas = j[i].mdas
        m.mdaf = j[i].mdaf
      }
      if (m.mdpf !== '') {
        pf = String(moment(m.mdpf).month() + 1)
        if (pf.length === 1) {
          pf = '0' + pf
        }
        m.month = pf
      }
      m.status = isdev ? j[i].status : j[i]['MilestoneStatus']
      p.push(m)
    }
  }
  p = p.sort(predicateBy('FY'))
  return p
}
