<template>
    <div class="minibox" :style="backgroundColor">
        <p class="material-icons">{{ icon }}</p>
        <p>{{ type }}</p>
        <p>{{ value.toLocaleString('en') }}</p>
    </div>
</template>

<script>
export default {
  name: 'Indicator',
  props: {
    icon: {
      type: String
    },
    type: {
      type: String
    },
    value: {
      type: Number
    },
    backgroundColor: {
      type: String
    }
  }
}
</script>

<style scoped lang="scss">
  
  .bg-color {
    background-color: #e7e8d1;
  }
  div {
    line-height: 1.25;
    font-size: 1rem;
    font-weight: 700;
    color: white;
  }
  .material-icons {
    font-size: 55px;
  }
  .minibox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    margin: 16px;
    border: 1px solid green;
  }

</style>