import sys
from rembg import remove
from PIL import Image

input_path = "suman6.jpeg"
output_path = "suman6-nobg.png"

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print("Done")
