#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import picocolors from "picocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const regularIconsDir = path.join(__dirname, "../icons/");
const solidIconsDir = path.join(__dirname, "../icons-solid/");

try {
    // Read SVG files from both directories
    const files1 = fs.readdirSync(regularIconsDir).filter(file => path.extname(file).toLowerCase() === '.svg');
    const files2 = fs.readdirSync(solidIconsDir).filter(file => path.extname(file).toLowerCase() === '.svg');

    // Check if both folders contain the same number of SVG icons
    if (files1.length !== files2.length) {
        console.error(
            picocolors.red(`❌ Error:`) +
            ` The number of SVG files in '${picocolors.yellow(regularIconsDir)}' (${picocolors.cyan(files1.length)}) and '${picocolors.yellow(solidIconsDir)}' (${picocolors.cyan(files2.length)}) are not the same.`
        );
        process.exit(1);
    }

    // Extract base names (without extensions) and sort them
    const names1 = files1.map(file => path.basename(file, '.svg')).sort();
    const names2 = files2.map(file => path.basename(file, '.svg')).sort();

    // Check if both folders have the same file names
    for (let i = 0; i < names1.length; i++) {
        if (names1[i] !== names2[i]) {
            console.error(
                picocolors.red(`❌ Error:`) +
                ` File name mismatch between '${picocolors.yellow(regularIconsDir)}' and '${picocolors.yellow(solidIconsDir)}': '${picocolors.cyan(names1[i])}' vs '${picocolors.cyan(names2[i])}'`
            );
            process.exit(1);
        }
    }

    // Check for file names containing numbers
    const filesWithNumbers = names1.filter(name => /\d/.test(name));
    if (filesWithNumbers.length > 0) {
        console.error(
            picocolors.red(`❌ Error:`) +
            ` File names containing numbers found: ${picocolors.cyan(filesWithNumbers.join(', '))}`
        );
        process.exit(1);
    }

    // Function to check file contents for 'evenodd'
    const checkForEvenOdd = (directory, fileList) => {
        for (let file of fileList) {
            const filePath = path.join(directory, `${file}.svg`);
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('evenodd')) {
                console.error(
                    picocolors.red(`❌ Error:`) +
                    ` File '${picocolors.yellow(filePath)}' contains '${picocolors.magenta('evenodd')}' in its content.`
                );
                process.exit(1);
            }
        }
    };

    // Check files in both directories for 'evenodd'
    checkForEvenOdd(regularIconsDir, names1);
    checkForEvenOdd(solidIconsDir, names2);

    // If all checks pass
    console.log(picocolors.green('✅ All checks passed successfully.'));
} catch (err) {
    console.error(picocolors.red(`❌ An unexpected error occurred:`), err);
    process.exit(1);
}
