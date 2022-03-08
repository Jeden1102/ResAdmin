<template>
    <div>
        xxx
        <b-form @submit.prevent="addProduct">
                <b-form-group label="Image cover:">
                <label for="file-in" class="file-label">
                    <h3>Add a movie</h3>
                    <img  src="@/assets/upload.png" alt="">
                </label>
                <input type="file" id="file-in" class="hidden" @change="previewPhoto" >        
                </b-form-group>
                <b-button type="submit">Dodaj</b-button>
                {{ videoUploadPercentage }}
                {{ moviesList }}
                <video width="320" height="240" controls v-for="movie of moviesList" :key="movie.id">
                    <source :src="`http://localhost:8000/storage/uploads/${movie.path}`" type="video/mp4">
                    <source src="movie.ogg" type="video/ogg">
                    Your browser does not support the video tag.
                    </video>
        </b-form>

    </div>
</template>

<script>
import axios from 'axios';

    export default {
        data() {
            return {
                                url:null,
                imgCover:null,
                videoUploadPercentage:0,
                moviesList:[],
            }
        },
        mounted() {
            this.getMovies()
        },
        methods: {
            getMovies(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/movies`).then(data=>{
                    this.moviesList = data.data;
                })
            },
                        previewPhoto(e){
                      const file = e.target.files[0];
                      this.imgCover = file;
                    this.url = URL.createObjectURL(file);
            },
                        addProduct(event){
                            console.log("ok");
                let existingObj = this;
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                            onUploadProgress: event => {
            this.videoUploadPercentage = Math.round(
                (event.loaded * 100) / event.total
            );
        },
                }
                let data = new FormData();
                data.append('file', this.imgCover);

                axios.post(`${process.env.VUE_APP_API_URL}/api/movies`, data, config)
                    .then(function (res) {
                      console.log(res);
                        existingObj.success = res.data.success;
                        event.target.reset()
                          existingObj.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: 'Product has been added succesfully!',
                        });
                    })
                    .catch(function (err) {
                        existingObj.output = err;
                    });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>