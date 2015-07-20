root = exports ? this
# global settings
_ref_url = "https://smoveweb.firebaseio.com/"
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
		updateUserList()
		n = _UserList.length
		# console.log(_UserList)
	# keep a _Chess
	ChessRef.on 'value',(snapshot) ->
		root._Chess = snapshot.val()
		updateChess()
	# keep player
	PlayerRef.on 'value',(snapshot) ->
		root._Player = snapshot.val()
	#hide the div to login
	login()
	resetChess(4)

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
			name = nameField.val()
			setName(name)
			$(loginDiv).remove()
			$('#canvas').show()
			game.run();




test = ->
	log = (arg...)->
		for i in arg
			console.log i

resetChess = (cols)->
	ChessRef.set({cols:cols})
	for x in [0..cols-1]
		for y in [0..cols-1]
			m = x+y*cols
			ChessRef.child(m).set(0)



window.updateUserList = ->
	# add function to update _UserList show
	return 
window.updateChess = ->
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
