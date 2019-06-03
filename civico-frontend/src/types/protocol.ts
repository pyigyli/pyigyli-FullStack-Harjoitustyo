type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'GET_DATA' |
  'SEND_DATA' |
  'FIELD_LEVELUP' |
  'ERROR'

export type Message =
  CreateAccountMessage |
  LoginMessage |
  LogoutMessage |
  TokenMessage |
  GetUserDataMessage |
  SendUserDataMessage |
  FieldLevelUpMessage |
  ErrorMessage

export interface MessageBase {
  type: MessageType
  token?: string
}

export interface CreateAccountMessage extends MessageBase {
  type: 'CREATE_ACCOUNT'
  username: string
  password: string
}

export interface LoginMessage extends MessageBase {
  type: 'LOGIN'
  username: string
  password: string
}

export interface LogoutMessage extends MessageBase {
  type: 'LOGOUT'
  token: string
}

export interface TokenMessage extends MessageBase {
  type: 'TOKEN'
  token: string
  username: string
}

export interface GetUserDataMessage extends MessageBase {
  type: 'GET_DATA'
  token: string
}

export interface SendUserDataMessage extends MessageBase {
  type: 'SEND_DATA'
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: {
    name: string
    level: number
  }[][]
  buildings: {
    name: string
    level: number
  }[][]
  map: number[]
  inbox: {
    sender: string
    title: string
    message: string
  }[]
  timestamp: number
}

export interface FieldLevelUpMessage extends MessageBase {
  type: 'FIELD_LEVELUP'
  token: string
  row: number
  column: number
  newLevel: number
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR'
  message: string
}

export interface UserData {
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: {
    name: string
    level: number
  }[][]
  buildings: {
    name: string
    level: number
  }[][]
  map: number[]
  inbox: {
    sender: string
    title: string
    message: string
  }[]
  timestamp: number
}

export interface FieldSlot {
  populationGain: number
  lumberRateGain: number
  ironRateGain: number
  clayRateGain: number
  wheatRateGain: number
  lumberCost: number
  ironCost: number
  clayCost: number
  wheatCost: number
}

export const fieldSlotData = {
  'FOREST': {
    upgradeText: 'Everyone needs wood. Just remember to replant the trees so you do not run out. Increases lumber gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 6,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 35,
      ironCost: 60,
      clayCost: 55,
      wheatCost: 20
    },
    2: {
      populationGain: 1,
      lumberRateGain: 11,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 100,
      ironCost: 120,
      clayCost: 100,
      wheatCost: 85
    },
    3: {
      populationGain: 2,
      lumberRateGain: 18,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 170,
      ironCost: 210,
      clayCost: 220,
      wheatCost: 150
    }
  },
  'CAVE': {
    upgradeText: 'From the darkest of caves the richest of iron minerals can be found. Increases iron gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 6,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 50,
      ironCost: 30,
      clayCost: 50,
      wheatCost: 25
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 11,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 100,
      ironCost: 95,
      clayCost: 120,
      wheatCost: 75
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 18,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 220,
      ironCost: 180,
      clayCost: 225,
      wheatCost: 145
    }
  },
  'CLAY': {
    upgradeText: 'Flexible material. Good for making pots and other things made of clay. Increases clay gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 6,
      wheatRateGain: 0,
      lumberCost: 50,
      ironCost: 45,
      clayCost: 25,
      wheatCost: 35
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 11,
      wheatRateGain: 0,
      lumberCost: 105,
      ironCost: 100,
      clayCost: 80,
      wheatCost: 75
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 18,
      wheatRateGain: 0,
      lumberCost: 200,
      ironCost: 200,
      clayCost: 175,
      wheatCost: 130
    }
  },
  'WHEAT': {
    upgradeText: 'Wheat is essential for keeping your people alive. Increases wheat gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 6,
      lumberCost: 45,
      ironCost: 45,
      clayCost: 50,
      wheatCost: 35
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 1,
      lumberCost: 95,
      ironCost: 100,
      clayCost: 95,
      wheatCost: 45
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 18,
      lumberCost: 200,
      ironCost: 210,
      clayCost: 205,
      wheatCost: 70
    }
  }
}
