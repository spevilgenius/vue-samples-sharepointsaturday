/* eslint-disable */
import ProjectService from '@/services/ProjectService.js'
import moment from 'moment'

export const namespaced = true

export const state = {
  badprojects: [],
  projects: [],
  project: {},
  projectsTotal: 0,
  loaded: false,
  loading: true,
  filtered: [],
  filteredCount: 0,
  filters: {
    managers: [],
    depts: [],
    divs:[],
    pjms: [],
    statuses: [],
    pstatuses: [],
    workorders: [],
    ppids: [],
    erpids: [],
    levels: [],
    years: []
  }
}

export const mutations = {
  ADD_PROJECTS(state, projects) {
    state.projects += projects
  },
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  SET_BADPROJECTS(state, projects) {
    state.badprojects = projects
  },
  SET_PROJECT(state, project) {
    state.project = project
  },
  SET_PROJECTS_TOTAL(state, pt) {
    console.log(pt + " projects found.")
    state.projectsTotal = pt
  },
  SET_LOADED(state, loaded) {
    state.loaded = loaded
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_FILTERED(state, filtered) {
    state.filtered = filtered
  },
  SET_FILTERED_COUNT(state, count) {
    state.filteredCount = count
  },
  SET_FILTERS(state, filters) {
    state.filters.managers = filters.managers
    state.filters.depts = filters.depts
    state.filters.divs = filters.divs
    state.filters.pjms = filters.pjms
    state.filters.statuses = filters.statuses
    state.filters.pstatuses = filters.pstatuses
    state.filters.levels = filters.levels
    state.filters.workorders = filters.workorders
    state.filters.ppids = filters.ppids
    state.filters.erpids = filters.erpids
  }
}

export const actions = {
  getProjects({ commit, dispatch }) {
    ProjectService.getProjects()
      .then(response => {
        let isdev = false
        let location = String(window.location)
        if (location.indexOf('localhost') > 0) {
          isdev = true
        }
        if (isdev) {
          commit('SET_FILTERED_COUNT', parseInt(response.data.length))
          commit('SET_PROJECTS', response.data)
          commit('SET_FILTERED', response.data)
          // dev so no filters for now
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        } else {
          commit('SET_PROJECTS_TOTAL', parseInt(response.length))
          commit('SET_PROJECTS', formatProjects(response))
          commit('SET_FILTERED', formatProjects(response))  // initally set filtered to all projects
          commit('SET_FILTERED_COUNT', response.length)
          commit('SET_FILTERS', getFilters(response))
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        }
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  setFilteredProjects({ commit }, projects) {
    console.log("Setting Filtered Projects. " + projects.length)
    commit('SET_FILTERED', projects)
    commit('SET_FILTERED_COUNT', projects.length)
  }
}

export const getters = {
  getProjects(state) {
    return state.projects
  }
}

function formatProjects(j) {
  var p = []
  // just loop and create the array with better keys
  for (var i = 0; i < j.length; i++) {
    if ((j[i]['Title'] !== null || j[i]['Title'] !== '') && j[i]['DeliverableMilestonesEditRecord']['Title'] === 'Y') {
      p.push({
        title: j[i]['ProjectTitle'],
        erpid: j[i]['Title'] !== null ? String(j[i]['Title']): '',
        id: j[i]['Id'],
        ppid: j[i]['PPID']['Title'] !== null ? String(j[i]['PPID']['Title']) : '',
        wid: j[i]['WorkOrderID'] !== null ? String(j[i]['WorkOrderID']) : '',
        dept: j[i]['DeptText'],
        div: j[i]['PjMCode']['Div'],
        pjm: j[i]['PjMCode']['Branch'],
        level: j[i]['ProjectLevelShort'],
        manager: j[i]['PM']['Title'],
        rstatus: j[i]['Status'],
        pstatus: j[i]['ProjectStatusText'],
        pstart: moment(j[i]['PlannedStart']).isValid()
          ? moment(j[i]['PlannedStart']).format('MM/DD/YYYY')
          : '',
        astart: moment(j[i]['ActualStart']).isValid()
          ? moment(j[i]['ActualStart']).format('MM/DD/YYYY')
          : '',
        pfinish: moment(j[i]['PlannedFinish']).isValid()
          ? moment(j[i]['PlannedFinish']).format('MM/DD/YYYY')
          : '',
        afinish: moment(j[i]['ActualFinish']).isValid()
          ? moment(j[i]['ActualFinish']).format('MM/DD/YYYY')
          : ''
      })
    }
  }
  return p
}

function getFilters(j) {
  var filters = {
    managers: [],
    depts: [],
    divs:[],
    pjms: [],
    statuses: [],
    pstatuses: [],
    workorders: [],
    ppids: [],
    erpids: [],
    levels: []
  }
  for (var i = 0; i < j.length; i++) {
    if (filters.managers.indexOf(j[i]['PM']['Title']) >= 0) { } else {
      filters.managers.push(j[i]['PM']['Title'])
    }
    if (filters.depts.indexOf(j[i]['DeptText']) >= 0) { } else {
      filters.depts.push(j[i]['DeptText'])
    }
    if (filters.divs.indexOf(j[i]['PjMCode']['Div']) >= 0) { } else {
      filters.divs.push(j[i]['PjMCode']['Div'])
    }
    if (filters.pjms.indexOf(j[i]['PjMCode']['Branch']) >= 0) { } else {
      filters.pjms.push(j[i]['PjMCode']['Branch'])
    }
    if (filters.statuses.indexOf(j[i]['Status']) >= 0) { } else {
      filters.statuses.push(j[i]['Status'])
    }
    if (filters.pstatuses.indexOf(j[i]['ProjectStatusText']) >= 0) { } else {
      filters.pstatuses.push(j[i]['ProjectStatusText'])
    }
    if (filters.workorders.indexOf(j[i]['WorkOrderID']) >= 0) { } else {
      filters.workorders.push(j[i]['WorkOrderID'])
    }
    if (filters.ppids.indexOf(j[i]['PPID']['Title']) >= 0) { } else {
      filters.ppids.push(j[i]['PPID']['Title'])
    }
    if (filters.erpids.indexOf(j[i]['Title']) >= 0) { } else {
      filters.erpids.push(j[i]['Title'])
    }
    if (filters.levels.indexOf(j[i]['ProjectLevelShort']) >= 0 ) { } else {
      filters.levels.push(j[i]['ProjectLevelShort'])
    }
  }
  filters.managers.sort()
  filters.depts.sort()
  filters.divs.sort()
  filters.pjms.sort()
  filters.statuses.sort()
  filters.pstatuses.sort()
  filters.workorders.sort()
  filters.ppids.sort()
  filters.erpids.sort()
  filters.levels.sort()
  return filters
}
