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
                resolve(data);
            });
        });

        let sprFileLoad = new Promise(resolve => {
            spr.load(sprFileName, function(data) {
                self.sprData = data;
                resolve(data);
            });
        });

        return Promise.all([datFileLoad, sprFileLoad]);
    }

    getObject(category, id) {
        console.log(this.data.getThingType(category, id));
        return this.data.getThingType(category, id);
    }

    getSprite(category, id) {
        let object = getObject(category, id);
        //TODO figure out what it means if groups.length > 1
        let groups = object.groups;
        let sprites = groups[0].sprites;    //keys of the sprites making up this object
        //TODO check sprite-extractor to see how to get .png from .spr
        //OR... pre-extract .pngs to folder and lookup by key. Needs proper transparency though (OT uses magenta for transparent).
        console.log(sprites);
    }

    getObjectCategories() {
        return ['item', 'outfit', 'effect', 'missile'];
    }

    getObjectsInCategory(category) {
        let key = category + 's';   //pluralise category to get from data with data[key]. TODO: add this to Metadata.js and avoid the switch-cases there
        return this.data[key];
    }
}