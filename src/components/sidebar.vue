<template>
    <div class="sidebar">
        <div class="logo">
            <h3>Stocks</h3>
        </div>
        <div class="content">
            <router-link to="/">Stocks</router-link>
            <router-link to="/stocksAdmin">Stocks Admin</router-link>
            <router-link to="/stocksView">Stocks View</router-link>
        </div>
    </div>
</template>

<script>
export default {

    data() {
        return {
        };
    },
   
    methods: {
        
    }
};
</script>
<style lang="scss" scoped>
    .sidebar{
        position: fixed;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        height: 100vh;
        width: 250px;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
        color: white;
        .logo{
            padding: 10px;
            text-align: center;
            h3{
                margin: 0;
            }
        }
        .content{
            display: flex;
            flex-direction: column;

            a{
                padding: 10px 10px 10px 20px;
                text-decoration: none;
                color: rgba($color: #ffffff, $alpha: .4);
                &:hover{
                    transition: 0.2s;
                    color: #14BAE3;
                    background-color: rgba($color: #000000, $alpha: .4);
                }
                &.router-link-active{
                    color: #14BAE3;
                    background-color: rgba($color: #000000, $alpha: .4);
                }
            }
        }
    }
</style>