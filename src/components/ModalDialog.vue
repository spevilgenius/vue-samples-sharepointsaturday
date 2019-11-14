<template>
  <div>
    <a
      v-if="dlgurl !== null && linktype === 'link'"
      href="#"
      class="exlink"
      @click.stop="showdialog()"
      >{{ linktitle }}</a
    >
    <b-button
      v-if="dlgdata === 'Y' && linktype === 'vbutton'"
      variant="success"
      size="sm"
      class="smallbutton"
      @click.stop="showdialog()"
      title="Variances"
      >Y</b-button
    >
    <b-button
      v-else-if="dlgdata === 'N' && linktype === 'vbutton'"
      variant="danger"
      size="sm"
      class="smallbutton"
      @click.stop="showdialog()"
      title="Variances"
      >N</b-button
    >
    <b-button
      v-if="dlgdata === 'Y' && linktype === 'sbutton'"
      variant="success"
      size="sm"
      class="smallbutton"
      @click.stop="showdialog()"
      title="Spend Plan"
      >Y</b-button
    >
    <b-button
      v-else-if="dlgdata === 'N' && linktype === 'sbutton'"
      variant="danger"
      size="sm"
      class="smallbutton"
      @click.stop="showdialog()"
      title="Spend Plan"
      >N</b-button
    >
  </div>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    dlgdata: String,
    dlgurl: String,
    linktype: String,
    variant: String
  },
  data: function() {
    return {
      linktitle: this.dlgdata
    }
  },
  methods: {
    showdialog: function() {
      window.open(
        this.dlgurl + '&isDlg=1',
        'blank',
        'width=1600, height=800, scrollbars=yes, resizable=yes'
      )
    }
  }
}
</script>

<style scoped></style>
