class Cube 
	constructor: (geometry, material ,c) ->
		@mesh = new THREE.Mesh( geometry, material )
		@mesh.position.set(c.x, c.y, c.z)
		@speed = new THREE.Vector3(c.speed.x, c.speed.y, c.speed.z)
		@rotationSpeed = new THREE.Euler(c.rotationSpeed.x, c.rotationSpeed.y, c.rotationSpeed.z)
	move: () ->
		@mesh.position.add @speed
		@mesh.rotation.x += @rotationSpeed.x
		@mesh.rotation.y += @rotationSpeed.y
		@mesh.rotation.z += @rotationSpeed.z	
		return
	colidesWithCamera: (camera, minSquaredDistance = 60) -> 
		if @mesh.position.distanceToSquared(camera.position) <= minSquaredDistance then true else false	
	set: (c) ->
		getIfNotNull = (p, d) -> if d isnt null and d isnt undefined then d else p
		@mesh.position.x = getIfNotNull(@mesh.position.x, c.x)
		@mesh.position.y = getIfNotNull(@mesh.position.y, c.y)
		@mesh.position.z = getIfNotNull(@mesh.position.z, c.z)
		if c.speed isnt undefined 
			@speed.x = getIfNotNull(@speed.x, c.speed.x)
			@speed.y = getIfNotNull(@speed.y, c.speed.y)
			@speed.z = getIfNotNull(@speed.z, c.speed.z)
		if c.rotationSpeed isnt undefined
			@rotationSpeed.x = getIfNotNull(@rotationSpeed.x, c.rotationSpeed.x)
			@rotationSpeed.y = getIfNotNull(@rotationSpeed.y, c.rotationSpeed.y)
		return		
window.Cube = Cube
