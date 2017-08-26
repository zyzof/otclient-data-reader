// Taken from https://github.com/TibiaJS/spritesheet-extractor

function ThingType(id, category) {
    this.id       = id;
    this.category = category;
    this.groups   = [];
}

ThingType.prototype.getFrameGroup = function(type) {
    if (type < this.groups.length) {
        return this.groups[type];
    }
    return null;
};

module.exports = ThingType;
