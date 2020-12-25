import Vue from 'vue'
import VueRouter from 'vue-router'
import Account from '../views/Account.vue'
import Signin from '../components/Account/Signin.vue'
import Signup from '../components/Account/Signup.vue'
import Main from '../views/Main.vue'
import Management from '../components/Management.vue'

Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/Account',
    name: 'Account',
    redirect: '/Account/Signin',
    component: Account,
    children: [
      {
        path: 'Signin',
        name: 'Signin',
        component: Signin
      },
      {
        path: 'Signup',
        name: 'Signup',
        component: Signup
      },
      {
        path: '*',
        redirect: '/Account/Signin'
      }
    ]
  },
  {
    path: '/',
    name: '/',
    redirect: '/Management',
    component: Main,
    children: [
      {
        path: 'Management',
        name: 'Management',
        component: Management
      },
      {
        path: 'Project/:project',
        name: 'project',
        redirect: '/Project/:project/Article',
        component: function () {
          return import('../components/Project.vue')
        },
        children: [
          {
            path: 'ArticleEdit/:id',
            name: 'articleEdit',
            component: function () {
              return import('../components/ArticleEdit.vue')
            }
          },
          {
            path: 'Article',
            name: 'Article',
            component: function () {
              return import('../components/Article.vue')
            }
          },
          {
            path: 'VideoEdit/:id',
            name: 'videoEdit',
            component: function () {
              return import('../components/VideoEdit.vue')
            }
          },
          {
            path: 'Video',
            name: 'Video',
            component: function () {
              return import('../components/Video.vue')
            }
          },
          {
            path: 'Tag',
            name: 'Tag',
            component: function () {
              return import('../components/Tag.vue')
            }
          },
          {
            path: '*',
            redirect: '/Project/:project/Article'
          }
        ]
      },
      {
        path: '*',
        redirect: 'Management'
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
