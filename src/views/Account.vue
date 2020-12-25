<template>
<div class="account">
    <slogon slogon="文章管理系统" />
    <div class="account-form">
        <router-view />
    </div>
</div>
</template>

<script>
import Slogon from '@/components/Account/Slogon.vue'
export default {
    name: 'Account',
    components: {
        'slogon': Slogon
    }
}
</script>

<style>
.account {
}

@media (min-width: 500px) {
    .account-form {
        margin: 0 35% !important;
    }
}

.account-form {
    margin: 0 10%;
}

.singnin-signup {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap
}

.singnin .ivu-btn,
.singnup .ivu-btn {
    width: 100%
}

.depart .ivu-form-item-content {
    display: flex;
}

.depart .ivu-select-selection {
    border-bottom-left-radius: 0 !important;
    border-top-left-radius: 0 !important;
}
</style>
