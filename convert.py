from PIL import Image
import glob
import uuid
import json
'''
This is just code I used to create the images.json
Guess I'll keep it around to use for other things
Maybe
I guess
'''

'''
Create a json.file with all images in it
Each image has seperate data fields with it
Example:
"images": [
    "0": {
        name = "002951f73529467db5bf80dad1454f3d"
        format = "JPEG"
        score = 0
    },
    . . .
],
"size": 994
'''
def createJson(image_list):
    lib = {"images": {}, "size": 0} # empty dict with only images and size key
    for i in range(len(image_list)):
        name = image_list[i].filename.split("\\")[-1][0:-4]
        lib["images"][i] = {"name": name, "format": image_list[i].format, "score": 100}
        lib["size"] = lib["size"] + 1

    with open("./images.json", "w", encoding="utf-8") as f:
        json.dump(lib, f, ensure_ascii=False, indent=4)


'''
Convert images to JPG not caring about old name
Creates new name using uuid library
Very low odds of repeating names...probably
'''
def newName(image_list):
    for i in image_list:
        filename = (uuid.uuid4().hex)
        if i.mode != "RGB":
            i = i.convert("RGB")
        i.save("./memes2/{}.jpg".format(filename))

'''
Mass convert images to JPG conserving old name
Makes new name when can't get old name
'''
def saveOld(image_list):
    for i in image_list:
        if i.mode != "RGB":
            i = i.convert("RGB")
        try:
            i.save("./memes2/{}.jpg".format(i.filename.split("\\")[-1][0:-4]))
        except:
            name = (uuid.uuid4().hex)
            i.save("./memes2/{}.jpg".format(name))

def main():
    image_list = []
    '''
    Gather all images in folder with specified ending
    '''
    for filename in glob.glob('./memes/*.jpg'):
        im=Image.open(filename)
        image_list.append(im)

    # newName(image_list)
    # saveOld(image_list)
    # createJson(image_list)

main()