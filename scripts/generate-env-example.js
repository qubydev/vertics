const fs = require("fs");
const path = require("path");

const filesToCheck = [".env.local", ".env.production", ".env"];
let selectedFile = null;

for (const file of filesToCheck) {
    if (fs.existsSync(path.join(process.cwd(), file))) {
        selectedFile = file;
        break;
    }
}

if (!selectedFile) {
    console.error("No .env, .env.local, or .env.production file found.");
    process.exit(1);
}

try {
    const envContent = fs.readFileSync(path.join(process.cwd(), selectedFile), "utf8");
    const exampleLines = envContent.split("\n").map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
            return line;
        }

        const firstEquals = trimmed.indexOf("=");
        if (firstEquals === -1) {
            return line;
        }

        const key = trimmed.slice(0, firstEquals).trim();
        return `${key}=`;
    });

    fs.writeFileSync(path.join(process.cwd(), ".env.example"), exampleLines.join("\n"));
    console.log(`Successfully generated .env.example from ${selectedFile}`);
} catch (error) {
    console.error("Error generating .env.example:", error.message);
    process.exit(1);
}