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
script = """{
	"position":[ %(x)f, %(y)f, %(z)f ],
	"boxes":[
""" % { 'x': root.location.x, 'y': root.location.y, 'z': root.location.z }

# in JSON, we cannot have trailing commas
delimiter = ""

# for each box of the map
for box in physics:
	# we add a comma between entries
	script += delimiter
	delimiter = ","
	# for each box, we recover its size, position and rotation
	ext = box.dimensions.copy() * 0.5
	pos = box.location
	rot = box.rotation_euler.to_quaternion()
	# we append the data of the box to the list
	script += """[
	[ %(sx)f, %(sx)f, %(sz)f ],
	[ %(px)f, %(py)f, %(pz)f ],
	[ %(rx)f, %(ry)f, %(rz)f, %(rw)f ]
]""" % {
		'sx': ext.x, 'sy': ext.y, 'sz': ext.z,
		'px': pos.x, 'py': pos.y, 'pz': pos.z,
		'rx': rot.x, 'ry': rot.y, 'rz': rot.z, 'rw': rot.w
	}

# end of script
script += "]}"

print(script)

"""
to reduce the size of the map files
the resulting JSON files will have the following template:
{
	"position":[x,y,z], // position of the body
	"boxes":[
		[ // info of the box
			[x,y,z],  // halfExtends of the box
			[x,y,z],  // offset position of the shape
			[x,y,z,w] // orientation of the shape
		],
		...
	]
}
"""
