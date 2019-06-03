import React from 'react'
import {Route, withRouter, RouteComponentProps} from 'react-router-dom'
import {createStyles, withStyles, WithStyles} from '@material-ui/core'
import {Message, LoginMessage, LogoutMessage, CreateAccountMessage, FieldLevelUpMessage, ExpandTownMessage} from '../types/protocol'
import CreateAccountScene from './scenes/CreateAccount'
import FieldsScene from './scenes/Fields'
import InboxScene from './scenes/Inbox'
import IndexScene from './scenes/Index'
import LoginScene from './scenes/Login'
import MapScene from './scenes/Map'
import TownScene from './scenes/Town'
import Header from './components/Header'
import Notification from './components/Notification'
import ProfileBar from './components/ProfileBar'

const styles = () => createStyles({
  root: {
    width: '100%',
    height: '100%',
    background: 'radial-gradient(80% 100%, #78377877, #321432dd)',
    color: '#321432'
  },
  pageContainer: {
    width: '50%'
  }
})

interface State {
  connection: WebSocket | null
  token: string
  username: string
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
  fields: Array<Array<{
    name: string
    level: number
  }>>
  buildings: Array<Array<{
    name: string
    level: number
  }>>
  map: number[]
  inbox: Array<{
    sender: string
    title: string
    message: string
  }>
  errorMessage: string
}

const NULL_STATE: State = {
  connection: null,
  token: '',
  username: '',
  population: 0,
  lumber: 0,
  iron: 0,
  clay: 0,
  wheat: 0,
  maxLumber: 0,
  maxIron: 0,
  maxClay: 0,
  maxWheat: 0,
  lumberRate: 0,
  ironRate: 0,
  clayRate: 0,
  wheatRate: 0,
  fields: [[{
    name: '',
    level: 0
  }]],
  buildings: [[{
    name: '',
    level: 0
  }]],
  map: [0, 0],
  inbox: [],
  errorMessage: ''
}

class App extends React.Component<RouteComponentProps & WithStyles<typeof styles>, State> {
  public state = {...NULL_STATE}
  public errorTimer: NodeJS.Timeout

  public componentDidMount() {
    this.connect()
    const token = window.localStorage.getItem('civico-token')
    const username = window.localStorage.getItem('civico-username')
    const connection = this.state.connection
    if (connection && token && username) {
      connection.send(JSON.stringify({type: 'GET_DATA', token}))
      this.setState({token, username})
      this.props.history.push('/fields')
    }
  }

  public componentWillUnmount() {
    const connection = this.state.connection
    if (connection) {
      connection.close()
    }
  }

  public componentDidUpdate(prevProps, prevState) {
    const {connection, token} = this.state
    if (connection && token) {
      connection.send(JSON.stringify({type: 'GET_DATA', token}))
    }
  }

  public connect() {
    const connection = new WebSocket(window.env.WS_API_URL || 'ws://localhost:3000')

    connection.addEventListener('open', () => {
      this.setState({connection})
    })

    connection.addEventListener('close', () => {
      this.setState(NULL_STATE)
      this.connect()
    })

    connection.addEventListener('message', evt => {
      const message: Message = JSON.parse(evt.data)
      switch (message.type) {
        case 'TOKEN':
          this.setState({token: message.token, username: message.username})
          if (message.token) {
            window.localStorage.setItem('civico-token', message.token)
            window.localStorage.setItem('civico-username', message.username)
            this.props.history.push('/fields')
          } else {
            window.localStorage.removeItem('civico-token')
            window.localStorage.removeItem('civico-username')
            this.props.history.push('/login')
          }
          break
        case 'SEND_DATA':
          this.setState({
            population: message.population,
            lumber: message.lumber,
            iron: message.iron,
            clay: message.clay,
            wheat: message.wheat,
            maxLumber: message.maxLumber,
            maxIron: message.maxIron,
            maxClay: message.maxClay,
            maxWheat: message.maxWheat,
            lumberRate: message.lumberRate,
            ironRate: message.ironRate,
            clayRate: message.clayRate,
            wheatRate: message.wheatRate,
            fields: message.fields,
            buildings: message.buildings,
            map: message.map,
            inbox: message.inbox
          })
          break
        case 'ERROR':
          this.handleErrorNotification(message.message)
          break
        default:
          console.error('Server sent a message of unknown type.') // tslint:disable-line:no-console
          break
      }
    })
  }

  public handleErrorNotification = (message: string) => {
    clearInterval(this.errorTimer)
    this.setState({errorMessage: message})
    this.errorTimer = setInterval(() => {
      this.setState({errorMessage: ''})
      clearInterval(this.errorTimer)
    }, 5000)
  }

  public handleLogin = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      const message: LoginMessage = {type: 'LOGIN', username, password}
      connection.send(JSON.stringify(message))
    }
  }

  public handleLogout = () => {
    window.localStorage.removeItem('civico-token')
    window.localStorage.removeItem('civico-username')
    this.setState({token: ''})
    const {connection, token} = this.state
    if (connection) {
      const message: LogoutMessage = {type: 'LOGOUT', token}
      connection.send(JSON.stringify(message))
    }
    this.props.history.push('/')
  }

  public handleCreateAccount = (username: string, password: string) => {
    const {connection} = this.state
    if (connection) {
      if (username.length > 2 && username.length < 16 && password.length > 4) {
        const message: CreateAccountMessage = {type: 'CREATE_ACCOUNT', username, password}
        connection.send(JSON.stringify(message))
      } else if (username.length < 3 && username.length < 16 && password.length < 5) {
        this.handleErrorNotification('Username and password too short. Please provide lengths of at least 3 and 5')
      } else if (username.length < 3) {
        this.handleErrorNotification('Username must be at least 3 characters long.')
      } else if (username.length > 15) {
        this.handleErrorNotification('Username cannot be over 15 characters long.')
      } else {
        this.handleErrorNotification('Password must be at least 5 characters long.')
      }
    }
  }

  public handleFieldLevelUp = (row: number, column: number, newLevel: number) => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: FieldLevelUpMessage = {type: 'FIELD_LEVELUP', token, row, column, newLevel}
      connection.send(JSON.stringify(message))
    }
  }

  public handleTownExpand = () => {
    const {connection, token} = this.state
    if (connection && token) {
      const message: ExpandTownMessage = {type: 'EXPAND_TOWN', token}
      connection.send(JSON.stringify(message))
    }
  }

  public render() {
    const {classes} = this.props
    const {
      token,
      fields,
      buildings,
      username,
      population,
      lumber,
      iron,
      clay,
      wheat,
      maxLumber,
      maxIron,
      maxClay,
      maxWheat,
      lumberRate,
      ironRate,
      clayRate,
      wheatRate,
      errorMessage
    } = this.state

    return (
      <div className={classes.root}>
        <Header
          token={token}
          username={username}
          onLogout={this.handleLogout}
        />
        <Notification message={errorMessage}/>
        <Route exact path='/' render={() =>
          <IndexScene/>
        }/>
        <Route exact path='/login' render={() =>
          <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/create-account' render={() =>
          <CreateAccountScene onSubmit={this.handleCreateAccount}/>
        }/>
        <Route exact path={['/fields', '/town']} render={() => 
          token && <ProfileBar
            population={population}
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            maxLumber={maxLumber}
            maxIron={maxIron}
            maxClay={maxClay}
            maxWheat={maxWheat}
          />
        }/>
        <Route exact path='/fields' render={() =>
          token ? <FieldsScene
            population={population}
            lumber={lumber}
            iron={iron}
            clay={clay}
            wheat={wheat}
            lumberRate={lumberRate}
            ironRate={ironRate}
            clayRate={clayRate}
            wheatRate={wheatRate}
            fields={fields}
            handleFieldLevelUp={this.handleFieldLevelUp}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/town' render={() =>
          token ? <TownScene
            buildings={buildings}
            onExpand={this.handleTownExpand}
          /> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/map' render={() =>
          token ? <MapScene/> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
        <Route exact path='/inbox' render={() =>
          token ? <InboxScene/> : <LoginScene onSubmit={this.handleLogin}/>
        }/>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(App))
