<template>
  <q-page class="flex flex-center bg-color">
    <div class="q-pa-md bigbox">
    	<div>Data comes from <a href="https://about-corona.net/">About-corona API</a></div> 
    	<div class="box">
    		<span>Application made with Quasar Framework</span>
    		<img class="rotate" src="../assets/quasar-logo.svg">
    	</div> 
    	<div>Contact: damientanguy75@gmail.com</div>
    	<div>Version V1.0</div>
	</div>
	<!--<div class="virus-container"><img class="virus" src="../assets/virus-image.png"></div>-->

  </q-page>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped lang="scss">
	
	.bg-color {
		background-color: #e7e8d1;
	}

	a {
      text-decoration:none;
   	}
	
	div {
		line-height: 3.25;
		font-size: 1rem;
		font-weight: 700;
	}

	img {
		height: 8vh;
		width: 8vw;
	}
	.bigbox {
		display: flex;
		flex-direction: column;
		margin: 10px;
		align-items: center;	
	}
	.box {
		display: flex;
		align-items: center;	
	}

	.rotate {
		animation: rotation 8s infinite linear;
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
	/*Virus animation*/
	/*.virus {
		height: 75px;
		width: 75px;
		display: block;
	    animation: 
	    			move_horizontally 9s linear infinite alternate,
	    			move_vertically 6s linear infinite alternate,
	    			rotation 8s infinite linear;
	}

	.virus-container {
	    font-size: 20px;
	    width: 100%;
	    height: 100%;
	    position: absolute;
	}

	.virus-container:after {
	    position: absolute;
	    left: 100%;
	    top: 100%;
	}

	@keyframes move_horizontally {
	    from {
	    	margin-left: 0%;
	    	}
	    to { 
	    	margin-left: 90%; 
	    }
	}
	@keyframes move_vertically {
	   	from {
	    	margin-top: 0%;
	    	}
	    to { 
	    	margin-top: 30%; 
	    }
	}*/
	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}


</style>
