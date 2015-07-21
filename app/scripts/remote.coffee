root = exports ? this
# global settings
_ref_url = "https://kehao.firebaseio.com/"
_name_input_id = ""
_usernum_to_colnum = {0:4,1:4,2:5,3:6,4:7,5:7}
_max_N = 4
###
	_UserList 	#idxxx :{name}
				#idxxx :{name}
 	ChessRef	N --- 1..4
				0:player
				(...):
				N^2-1:player
		
player =={0,name1,name2...}
###

init  = ->
	# the data refs
	root.BaseRef = new Firebase(_ref_url)
	root.UserListRef = BaseRef.child('UserList')
	root.ChessRef = BaseRef.child('Chess')
	# the current player info global vars
	# Auto remove when disconnect
	# To distingCuish users and the current player
	root.PlayerRef = UserListRef.push()
	PlayerRef.set({name:"",state:"online"})
	PlayerRef.onDisconnect().remove()
	# globale vars
	root._UserList = undefined
	root._Chess = undefined
	root._Player = undefined
	# keep a userlist global
	UserListRef.on 'value',(snapshot) ->
		root._UserList = []
		snapshot.forEach (childSnapshot) ->
			_UserList.push(childSnapshot.val())
			return false
		#alert('onvalue')
		console.log('UserListRef.on.val',_UserList)
		_updateUserList()
		n = _UserList.length
		#console.log(_UserList)
	# keep a _Chess
	ChessRef.on 'value',(snapshot) ->
		root._Chess = snapshot.val()
		_updateChess()
	# keep player
	PlayerRef.on 'value',(snapshot) ->
		root._Player = snapshot.val()
	#hide the div to login
	login()
	resetChess(6)

login = ->
	$('canvas').hide()
	LogDiv = $('<div>').attr('id','loginDiv')
	LogDiv.append("<input type='text' id='nameInput' placeholder='enter a username...'>")
	$('body').append(LogDiv)
	nameField  = $('#nameInput')
	nameField.focus()
	nameField.blur ->
		nameField.focus()
	nameField.keypress (e)->
		if e.keyCode == 13
			gameProcess(0)# set the process and wait the users
			name = nameField.val()
			setName(name)
			setState('ready')
			$(loginDiv).append($('<p>').append("Hello #{name} please wait for other players"))
window.Alert  = ->
	alert('hello')

window.onTimeRun = (ts,fn) ->
	console.log 'ts:'+ts
	timeNow = new Date().getTime()
	console.log 'current: '+timeNow
	window.setTimeout(Alert, ts-timeNow)


resetChess = (cols)->
	ChessRef.set({cols:cols})
	for x in [0..cols-1]
		for y in [0..cols-1]
			m = x+y*cols
			ChessRef.child(m).set(0)


window.gameProcess = (e)->
	# 0 waiting
	# 1 in game 
	# 2 game over
	if e ==  undefined
		return window.__gameProcess
	else 
		window.__gameProcess = e;

window._updateUserList = ->
	# add function to update _UserList show
	# alert('update')
	console.log('_updateUserList',_UserList)
	isReady = ->
		Ready = true
		console.log(_UserList)
		for i in _UserList
			if i.state != 'ready'
				Ready = false
		return Ready
	endGame = ->
		$('#canvas').hide()

	if gameProcess() == 0
		console.log('isready',isReady())
		if isReady()
			#alert('game run')
			$(loginDiv).remove()
			$('#canvas').show()
			gameProcess(1)
			setState('alive')
			game.run()


	if gameProcess() == 0
		alive = 0
		for i in _UserList
			if i.state == 'alive'
				alive++
		console.log ('alive:'+alive)
		if alive == 1
			endGame()



	return 
window._updateChess = ->
	# on _Chess change update _Chess
	return 

window.setName = (name) ->
	#set the player name and chang the playerName v
	if (name == "" || name  == undefined)
		console.error('failed to set name')
		return false
	else 
		PlayerRef.update({name:name})
		return true

window.setState = (state) ->
	if (state == "" || state  == undefined)
		console.error('failed to set state')
		return false
	else 
		PlayerRef.update({state:state})
		return true

window.getUserList = ->
	return _UserList
window.getChess = ->
	return _Chess
window.getPlayer = ->
	return _Player

window.getUserRefByName = (name) ->
	# get the ref of the user whit the name 
	UserListRef.on 'value',(snapshot) ->
		ref = null
		snapshot.forEach(childSnapshot) ->
			if childSnapshot.name == name
				return childSnapshot.ref()
			else 
				return false

window.ChessPosition = (x,y,set) ->
	# return the val if set is undefined
	n = x+(_Chess.cols*y)
	if set == undefined
		return 	_Chess[n]
	else
		n = x+(_Chess.cols*y)
		ChessRef.child(n).set(set)

window.PlayerState = (s) ->
	if s == undefined
		return CurrentState
	else 
		PlayerRef.update({state:s})


init()
