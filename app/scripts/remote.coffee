root  = exports ? this
# global settings
_ref_url = "https://kehao.firebaseio.com/"
_name_input_id = ""
_usernum_to_colnum = {0:4,1:4,2:5,3:6,4:7,5:7}
_max_N = 4
###
	UserList 	#idxxx :{name}
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
	# To distinguish users and the current player
	root.PlayerRef = UserListRef.push()
	PlayerRef.set({name:""})
	PlayerRef.onDisconnect().remove()

	# keep a userlist global
	UserListRef.on 'value',(snapshot) ->
		root.userList = []
		snapshot.forEach (childSnapshot) ->
			userList.push(childSnapshot.val())
			return false
		updateUserList()
		n = userList.length
		console.log(userList)
	# keep a Chess
	ChessRef.on 'value',(snapshot) ->
		#root.Chess = {}
		root.Chess = snapshot.val()
		updateChess()
	# keep player
	PlayerRef.on 'value',(snapshot) ->
		root.Player = snapshot.val()
	# get the DOM Elememts
	

	test()
test = ->
	log = (arg...)->
		for i in arg
			console.log i

resetChess = (n)->
	ChessRef.set({N:n})
	cols= _usernum_to_colnum[n]
	for x in [0..cols-1]
		for y in [0..cols-1]
			m = x+y*cols
			ChessRef.child(m).set(0)



root.updateUserList = ->
	# add function to update UserList show
	return 
root.updateChess = ->
	# on Chess change update Chess
	return 

root.setName = (name) ->
	#set the player name and chang the playerName v
	if (name == "" || name  == undefined)
		console.error('failed to set name')
		return false
	else 
		PlayerRef.update({name:name})
		return true

root.getUserList = ->
	return userList
root.getChess = ->
	return Chess
root.getPlayer = ->
	return player

root.getUserRefByName = (name) ->
	# get the ref of the user whit the name 
	UserListRef.on 'value',(snapshot) ->
		ref = null
		snapshot.forEach(childSnapshot) ->
			if childSnapshot.name == name
				return childSnapshot.ref()
			else 
				return false

root.ChessPosition = (x,y,set) ->
	# return the val if set is undefined
	if set == undefined
		return 	Chess[x+(Chess.N*y)]
	else
		n = x+(_usernum_to_colnum[Chess.N]*y)
		ChessRef.child(n).set(set)




window.onload = ->
 init()