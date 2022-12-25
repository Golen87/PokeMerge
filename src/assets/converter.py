import sys, os, glob, re, math
# from os import listdir
# from os.path import isfile, join, basename
from PIL import Image


def read_input():
	input_map = {}

	N = input()
	for n in range(int(N)):

		M, name, width, height = re.split(r"\t+", input())
		k = (name, int(width), int(height))
		input_map[k] = []

		for m in range(int(M)):
			_, key, path = re.split(r"\t+", input())
			input_map[k].append((key, path))

	return input_map

def solve(pack, files):
	group_name, desired_width, desired_height = pack

	# Load all images
	images = [Image.open(path) for key, path in files]

	# Find min-max width and height for all images
	all_widths = [im.size[0] for im in images]
	all_heights = [im.size[1] for im in images]
	width_range = ( min(all_widths), max(all_widths) )
	height_range = ( min(all_heights), max(all_heights) )

	# If size is optional -1, set to max of input
	if desired_width < 0:
		assert (height_range[0] == height_range[1]), "Panic"
		desired_width = math.ceil((desired_height / height_range[0]) * width_range[1])
	if desired_height < 0:
		assert (width_range[0] == width_range[1]), "Panic"
		desired_height = math.ceil((desired_width / width_range[0]) * height_range[1])

	hor_tiles = math.ceil(len(images)**0.5)
	ver_tiles = math.ceil(len(images)/hor_tiles)
	master_width = desired_width * hor_tiles
	master_height = desired_height * ver_tiles

	# Debug
	print()
	print(f"=== {group_name} ===")
	print(f"- Images {len(images)}")
	print(f"- Input [{width_range[0]}-{width_range[1]}, {height_range[0]}-{height_range[1]}]")
	print(f"- Output [{desired_width}, {desired_height}]")
	print(f"- Tiles {hor_tiles}x{ver_tiles}")
	print(f"- Final [{master_width}, {master_height}]")


	key_map = {}

	# if width_range[0] == width_range[1] == height_range[0] == height_range[1] and desired_width == desired_height:
	master = Image.new(
		mode='RGBA',
		size=(master_width, master_height),
		color=(0,0,0,0))

	for index in range(len(files)):
		key = files[index][0]
		image = images[index]
		width = image.size[0]
		height = image.size[1]
		# print(key, width, height)

		scale = min(desired_width / width, desired_height / height)
		scaled_width = round(width * scale)
		scaled_height = round(height * scale)
		# print(f"{width}.{height} -> {desired_width}.{desired_height} = {scaled_width}.{scaled_height}")

		offset_x = desired_width - scaled_width
		offset_y = desired_height - scaled_height
		x = desired_width * (index % hor_tiles) + offset_x
		y = desired_height * (index // hor_tiles) + offset_y

		image = image.resize((scaled_width, scaled_height), Image.ANTIALIAS)

		master.paste(image, (x,y))
		key_map[key] = index

	# master.save(f"{group_name}_{desired_width}.png")
	master.save(f"{group_name}.png")

	for image in images:
		image.close()

	print()
	print(f"{group_name}_map = {key_map};")


# Handle input file

print("python3 converter.py < input")
input_map = read_input()

for key in input_map:
	solve(key, input_map[key])
