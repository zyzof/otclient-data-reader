let PNGImage = require('pngjs-image')

let Metadata = require('./src/Metadata.js');
let Sprites = require('./src/Sprites.js');

module.exports = class OTClientDataReader {
    constructor() {
        this.data = {};
        this.sprData = {};
    }

    load(folderName) {

        let datFileName = folderName + '/Tibia.dat';
        let sprFileName = folderName + '/Tibia.spr';
        let meta = new Metadata();
        let spr = new Sprites();
        let self = this;

        let datFileLoad = new Promise(resolve => {
            meta.load(datFileName, function(data) {
                //console.log('dat file loaded');
                self.data = data;
                console.log('resolving datFileLoad');
                resolve(data);
            });
        });

        let sprFileLoad = new Promise(resolve => {
            spr.load(sprFileName, function(data) {
                self.sprData = data;
                console.log('resolving sprFileLoad');
                resolve(data);
            });
        });

        return Promise.all([datFileLoad, sprFileLoad]);
    }

    getObject(category, id) {
        console.log(this.data.getThingType(category, id));
        return this.data.getThingType(category, id);
    }

    getObjectCategories() {
        return ['item', 'outfit', 'effect', 'missile'];
    }

    getObjectsInCategory(category) {
        let key = category + 's';   //pluralise category to get from data with data[key]. TODO: add this to Metadata.js and avoid the switch-cases there
        return this.data[key];
    }

    getSprite(category, id) {
        let object = this.getObject(category, id);
        let groups = object.groups;

        let image = this._createSpriteSheet(groups[0]);
        //image.writeImage('test.png');
    }

    getSpriteSheet(category, id) {
        var thing = this.data.getThingType(category, id);
        for (var i = 0; i < thing.groups.length; i++) {
            var group = thing.getFrameGroup(i);
            if (group != null) {
                var fileName = category + '_' + id;
                if (category === 'outfit') {
                    if (i === 0) {
                        fileName = 'idle_' + fileName;
                    }
                    else {
                        fileName = 'walking_' + fileName;
                    }
                }
                var image = this._createSpriteSheet(group);
                //image.writeImage('test.png');
            }
        }
    }

    _createSpriteSheet(frameGroup) {
        // Measures and creates the image.
        var size = 32,
            totalX = frameGroup.patternZ * frameGroup.patternX * frameGroup.layers,
            totalY = frameGroup.frames * frameGroup.patternY,
            bitmapWidth = (totalX * frameGroup.width) * size,
            bitmapHeight = (totalY * frameGroup.height) * size,
            pixelsWidth = frameGroup.width * size,
            pixelsHeight = frameGroup.height * size,
            image = PNGImage.createImage(bitmapWidth, bitmapHeight);
    
        for (var f = 0; f < frameGroup.frames; f++) {
            for (var z = 0; z < frameGroup.patternZ; z++) {
                for (var y = 0; y < frameGroup.patternY; y++) {
                    for (var x = 0; x < frameGroup.patternX; x++) {
                        for (var l = 0; l < frameGroup.layers; l++) {
    
                            var index = this.getTextureIndex(frameGroup, l, x, y, z, f);
                            var fx = (index % totalX) * pixelsWidth;
                            var fy = Math.floor(index / totalX) * pixelsHeight;
    
                            for (var w = 0; w < frameGroup.width; w++) {
                                for (var h = 0; h < frameGroup.height; h++) {
    
                                    index = this.getSpriteIndex(frameGroup, w, h, l, x, y, z, f);
                                    var px = ((frameGroup.width - w - 1) * size);
                                    var py = ((frameGroup.height - h - 1) * size);
                                    this.sprData.copyPixels(frameGroup.sprites[index], image, px + fx, py + fy);
                                }
                            }
                        }
                    }
                }
            }
        }
        return image;
    }

    getTextureIndex(group, l, x, y, z, f) {
        return (((f % group.frames * group.patternZ + z) * group.patternY + y) * group.patternX + x) * group.layers + l;
    }
      
    getSpriteIndex(group, w, h, l, x, y, z, f) {
        return ((((((f % group.frames) * group.patternZ + z) * group.patternY + y) * group.patternX + x) * group.layers + l) * group.height + h) * group.width + w;
    };
      
}