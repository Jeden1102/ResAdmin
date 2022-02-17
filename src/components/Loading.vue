<template>
    <div class="loading" >
        <div class="loading-box">
       <h2><slot></slot></h2> 
      <span></span>
        </div>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.loading {
    .loading-box{
        background: rgba( 255, 255, 255, 0.25 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 4px );
-webkit-backdrop-filter: blur( 4px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:25px;
    }
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  position:fixed;
  left:0;
  top:0;
  background-color: rgba(0,0,0,.4);
  z-index:999;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid transparent;
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>