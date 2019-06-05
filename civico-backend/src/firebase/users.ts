import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import {UserData, GridSlot} from '../types/protocol'
import Connection from '../connection'

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  try {
    const findDuplicateUser = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    if (findDuplicateUser.toJSON()) {
      conn.sendMessage({type: 'ERROR', message: 'Username already taken.'})
      return false
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const ref = db.ref(`users`).push({
      username,
      passwordHash,
      population: 1,
      lumber: 250,
      iron: 250,
      clay: 250,
      wheat: 250,
      maxLumber: 500,
      maxIron: 500,
      maxClay: 500,
      maxWheat: 500,
      lumberRate: 5,
      ironRate: 5,
      clayRate: 5,
      wheatRate: 5,
      fields: [
        [
          {name: '?CAVE', level: 0},
          {name: '?ELECTRICITY', level: 0},
          {name: '?CLAY', level: 0}, 
          {name: '?CAVE', level: 0},
          {name: '?WHEAT', level: 0}
        ], [
          {name: '?WHEAT', level: 0},
          {name: '?WHEAT', level: 0},
          {name: 'FOREST', level: 0},
          {name: '?CAVE', level: 0},
          {name: '?WHEAT', level: 0}
        ], [
          {name: '?FOREST', level: 0},
          {name: 'CLAY', level: 0},
          {name: 'TOWN', level: 0},
          {name: 'CAVE', level: 0},
          {name: '?CLAY', level: 0}
        ], [
          {name: '?LAIR', level: 0},
          {name: '?WHEAT', level: 0},
          {name: 'WHEAT', level: 0},
          {name: '?LAKE', level: 0},
          {name: '?AIRPORT', level: 0}
        ], [
          {name: '?FOREST', level: 0},
          {name: '?CAVE', level: 0},
          {name: '?FOREST', level: 0},
          {name: '?CLAY', level: 0},
          {name: '?FOREST', level: 0}
        ]
      ],
      buildings: [
        [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ], [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ], [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ]
      ],
      map: [0, 0], // TODO
      inbox: [], // TODO welcoming message
      timestamp: new Date().getTime()
    })
    const user = await ref.once('value')
    conn.id = user.key || ''
    return true
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const login = async (conn: Connection, username: string, password: string) => {
  try {
    const user = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    const userJSON = user.toJSON()
    if (userJSON && await bcrypt.compare(password, Object.values(userJSON)[0].passwordHash)) {
      const id = Object.keys(userJSON)[0]
      const token = `Bearer ${jwt.sign(id, process.env.SECRET || 'DEVELOPMENT')}`
      await db.ref(`users/${id}/token`).set(token)
      conn.id = id
      return token
    }
    return null
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const logout = (conn: Connection) => {
  try {
    db.ref(`users/${conn.id}/token`).remove()
    conn.id = ''
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getUserData = async (conn: Connection) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user = userReference.toJSON() as UserData
    if (user) {
      const fields: GridSlot[][] = []
      Object.values(user.fields).forEach((row: any[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => {
          rowToPush.push(slot)
        })
        fields.push(rowToPush)
      })
      const buildings: GridSlot[][] = []
      Object.values(user.buildings).forEach((row: any[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => {
          rowToPush.push(slot)
        })
        buildings.push(rowToPush)
      })
      const map = [...Object.values(user.map)]
      const timePassed = new Date().getTime() - user.timestamp
      conn.sendMessage({
        type: 'SEND_DATA',
        ...user,
        lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate , user.maxLumber),
        iron: Math.min(user.iron + timePassed / 3600000 * user.ironRate, user.maxIron),
        clay: Math.min(user.clay + timePassed / 3600000 * user.clayRate, user.maxClay),
        wheat: Math.min(user.wheat + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat),
        fields,
        buildings,
        map
      })
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
