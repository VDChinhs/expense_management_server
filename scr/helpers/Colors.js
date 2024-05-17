class HelpColor {
    randomColorFromBaseColor() {
        var baseRGB = this.hexToRGB(this.baseColor);

        var red = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue = Math.floor(Math.random() * 256);

        var newColor = [
            this.clamp(baseRGB[0] + red),
            this.clamp(baseRGB[1] + green),
            this.clamp(baseRGB[2] + blue)
        ];

        var newHexColor = this.RGBToHex(newColor);

        return newHexColor;
    }

    hexToRGB(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    RGBToHex(rgb) {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    clamp(value) {
        return Math.max(0, Math.min(255, value));
    }

    baseColor = "#AE4B4B";
}

module.exports = new HelpColor;