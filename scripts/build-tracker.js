const fs = require("fs/promises");
const path = require("path");
const terser = require("terser");

const root = path.resolve(__dirname, "..");
const inputPath = path.join(root, "src", "tracker", "vertics.js");
const outputPath = path.join(root, "public", "vertics.min.js");

async function buildTracker() {
    const source = await fs.readFile(inputPath, "utf8");
    const result = await terser.minify(source, {
        compress: {
            passes: 2,
        },
        mangle: true,
        format: {
            comments: false,
        },
    });

    if (result.error) {
        throw result.error;
    }

    await fs.writeFile(outputPath, `${result.code}\n`);
    console.log(`Built ${path.relative(root, outputPath)} (${result.code.length} bytes)`);
}

buildTracker().catch((error) => {
    console.error(error);
    process.exit(1);
});
