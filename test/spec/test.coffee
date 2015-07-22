describe 'Import Files' , ->
	it 'import main.js',->
		assert.isFunction  Game,'gameProcess'
	it  'import remote.js',->
		assert.isFunction  onTimeRun, 'onTimeRun'


describe 'firebase',->
	it 'Is instanceof firebase',->
		expect(BaseRef).to.be.an.instanceof(Firebase)
		expect(ChessRef).to.be.an.instanceof(Firebase)
		expect(TimeRef).to.be.an.instanceof(Firebase)
		expect(UserListRef).to.be.an.instanceof(Firebase)
		expect(PlayerRef).to.be.an.instanceof(Firebase)
	it 'Global vars defination: this will pass',->
		assert.isDefined(_Player)
		assert.isDefined(_Chess)
	describe 'APIs', ->
		it 'Get Chess Position',->
			a = ChessPosition(5,5)
			expect(a).to.equal(0)
		it 'Set Chess Position',->
			ChessPosition(3,3,'val')
			b = ChessPosition(3,3)
			expect(b).to.equal('val')
		it 'Get player state',->
			state = _Player.state
			assert (state in ['online','ready','alive','fail'])
		it 'Set Player state',->
			setState('ready')
			state = _Player.state
			expect(state).to.equal('ready')
		it 'Set Player name',->
			setName('var')
			name = _Player.name
			expect(name).to.equal('var')

