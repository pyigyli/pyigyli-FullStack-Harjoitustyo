type MessageType = 'CREATE_ACCOUNT' | 'LOGIN' | 'LOGOUT' | 'TOKEN' | 'ERROR'

export type Message = CreateAccountMessage | LoginMessage | LogoutMessage | TokenMessage | ErrorMessage

export interface MessageBase {
  type: MessageType
  token?: string
}

export interface CreateAccountMessage extends MessageBase {
  type: 'CREATE_ACCOUNT',
  username: string,
  password: string
}

export interface LoginMessage extends MessageBase {
  type: 'LOGIN',
  username: string,
  password: string
}

export interface LogoutMessage extends MessageBase {
  type: 'LOGOUT',
  token: string
}

export interface TokenMessage extends MessageBase {
  type: 'TOKEN',
  token: string
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR',
  message: string
}