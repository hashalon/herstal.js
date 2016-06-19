"""
to use this script, you need an object with the name "PHYSICS"
all of the children of this object will create CANNON.Box based on their
dimensions, locations and rotation
"""

import math
import bpy
import mathutils

# we recover the parent of our physic boxes
root = bpy.data.objects["PHYSICS"]

# we store our shapes in a array
physics = []

# for each object of the scene
for obj in bpy.data.objects:
	# if the object is a child of "PHYSICS"
	if obj.parent == root:
		# we add the object to the list
		physics.append(obj)

# we create our javascript script
script = """
var map = new CANNON.Body({
	position: { x: %(x)f, y: %(y)f, z: %(z)f },
	fixedRotation: true,
	collisionFilterGroup: World.FILTER.group,
	collisionFilterMask: World.FILTER.mask,
}); """ % { 'x': root.location.x, 'y': root.location.y, 'z': root.location.z }

# for each box of the map
for box in physics:
	ext = box.dimensions.copy() * 0.5
	pos = box.location
	rot = box.rotation_euler.to_quaternion()
	script += """
map.addShape(
	new CANNON.Box({ x: %(sx)f, y: %(sx)f, z: %(sz)f }),
	{ x: %(px)f, y: %(py)f, z: %(pz)f },
	{ x: %(rx)f, y: %(ry)f, z: %(rz)f, w: %(rw)f }
); """ % {
		'sx': ext.x, 'sy': ext.y, 'sz': ext.z,
		'px': pos.x, 'py': pos.y, 'pz': pos.z,
		'rx': rot.x, 'ry': rot.y, 'rz': rot.z, 'rw': rot.w
	}

# end of script
script += ""

print(script)
