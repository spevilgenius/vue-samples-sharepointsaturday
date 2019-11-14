<template>
  <b-nav tabs>
    <b-nav-item exact active :to="{ name: 'Projects' }">Projects</b-nav-item>
    <b-nav-item exact active-class="active" :to="{ name: 'ProjectMilestones' }"
      >Milestones By Project</b-nav-item
    >
  </b-nav>
</template>

<script>
export default {
  name: 'Navbar',
  mounted: function() {
    this.$store.dispatch('support/getCauses')
    this.$store.dispatch('support/getOrgs')
    this.$store.dispatch('support/getMilestones')
  }
}
</script>
