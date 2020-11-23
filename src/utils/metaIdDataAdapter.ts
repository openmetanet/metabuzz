import { HttpRequests } from '@/utils/request'
import { UserInfoTypes } from '@/store/metasv-buzz'
import AppConfig from '@/config/metasv-buzz'

export default class MetaIdDataApapter {
  db: IDBDatabase | null = null
  constructor() {
    const DBOpenRequest = window.indexedDB.open('metaid', 1)
    DBOpenRequest.onupgradeneeded = (event) => {
      const db = event.target.result
      const userStore = db.createObjectStore('users', { keyPath: 'metaId', autoIncrement: false })
      userStore.createIndex('metaId', 'metaId', { unique: true })
      userStore.createIndex('name', 'name')
      userStore.createIndex('address', 'address')
      userStore.createIndex('update', 'update')
    }
    DBOpenRequest.onsuccess = () => {
      // 存储数据结果
      this.db = DBOpenRequest.result
      // 做其他事情...
    }
  }
  private dbAddUser(userInfo: UserInfoTypes) {
    if (!this.db) {
      return console.error('Db not open')
    }
    userInfo['update'] = new Date().getTime()
    const transaction = this.db.transaction('users', 'readwrite')
    const usersStore = transaction.objectStore('users')
    usersStore.add(userInfo)
  }
  private dbEditUser(metaId: string, userInfo: UserInfoTypes) {
    if (!this.db) {
      return console.error('Db not open')
    }
    userInfo['update'] = new Date().getTime()
    const transaction = this.db.transaction('users', 'readwrite')
    const usersStore = transaction.objectStore('users')
    const usersStoreRequest = usersStore.get(metaId)
    usersStoreRequest.onsuccess = () => {
      const user = usersStoreRequest.result
      for (const key in userInfo) {
        if (typeof user[key] !== 'undefined') {
          user[key] = userInfo[key]
        }
      }
      usersStore.put(user)
    }
  }
  private dbGetUser(metaId: string) {
    return new Promise((resolve, reject) => {
      const usersStore = this.db.transaction('users').objectStore('users')
      const request = usersStore.get(metaId)
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }
      request.onerror = (event) => {
        reject(event)
      }
    })
  }
  private getUserInfoFromApi(metaId: string) {
    const Http = new HttpRequests()
    const url = AppConfig.metaIdServiceUrl + '/showMANDB/api/v1/query/getMetaIDInfo/' + metaId
    return Http.getFetch(url)
  }
  public async getUserInfo(metaId: string, isCache = true) {
    const localUserInfo = await this.dbGetUser(metaId)
    if (localUserInfo && isCache) {
      return localUserInfo
    } else if (localUserInfo && !isCache) {
      const remoteUserInfoRes = await this.getUserInfoFromApi(metaId)
      if (remoteUserInfoRes.code === 200) {
        const userInfo = remoteUserInfoRes.result
        this.dbEditUser(metaId, userInfo)
        return userInfo
      }
    } else {
      const remoteUserInfoRes = await this.getUserInfoFromApi(metaId)
      if (remoteUserInfoRes.code === 200) {
        const userInfo = remoteUserInfoRes.result
        this.dbAddUser(userInfo)
        return userInfo
      }
    }
  }
}
