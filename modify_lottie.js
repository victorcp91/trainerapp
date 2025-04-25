const fs = require("fs");
const path = require("path");

// --- Configuration ---
const LOTTIE_DIR = path.join(__dirname, "src", "images", "lottie"); // Assumes script is run from project root
const BLUE_THRESHOLD = 0.5; // Definition of 'blue'
// --- End Configuration ---

/**
 * Checks if a Lottie color array [R, G, B] is considered 'blue'.
 * @param {Array<number>} colorArray - The color array [R, G, B] normalized 0-1.
 * @returns {boolean} - True if considered blue, false otherwise.
 */
function isBlue(colorArray) {
  if (!Array.isArray(colorArray) || colorArray.length < 3) {
    return false;
  }
  const [r, g, b] = colorArray.slice(0, 3);
  return b > r && b > g && b > BLUE_THRESHOLD;
}

/**
 * Recursively processes shapes, returning only those that should be kept.
 * @param {Array<object>} shapes - The list of shapes ('it' array).
 * @returns {{shapesToKeep: Array<object>}} - Filtered list of shapes.
 */
function processShapes(shapes) {
  if (!Array.isArray(shapes)) {
    return { shapesToKeep: [] };
  }

  let shapesToKeep = [];
  let currentBlueStatus = false; // Start assuming non-blue context

  // Iterate FORWARDS because color applies forward
  for (const shape of shapes) {
    if (typeof shape !== "object" || shape === null) continue;

    const shapeType = shape.ty;
    let isColorDefinition = false;

    // Check for static Fill ('fl') or Stroke ('st') color
    let colorProp = null;
    if (
      (shapeType === "fl" || shapeType === "st") &&
      shape.ks?.c?.k &&
      Array.isArray(shape.ks.c.k) &&
      (shape.ks.c.a === undefined || shape.ks.c.a === 0)
    ) {
      colorProp = shape.ks.c.k;
    }

    if (colorProp) {
      // Update the current color status
      currentBlueStatus = isBlue(colorProp);
      isColorDefinition = true;
      // KEEP all color definitions, as they affect subsequent elements
      shapesToKeep.push(shape);
      // console.log(`  Found color ${colorProp}. Is blue: ${currentBlueStatus}. Keeping color definition.`);
      continue; // Process next shape
    }

    // If it's a group, recurse
    if (shapeType === "gr") {
      const groupResult = processShapes(shape.it || []);
      // Keep the group wrapper only if it contains elements after filtering
      if (groupResult.shapesToKeep.length > 0) {
        shape.it = groupResult.shapesToKeep; // Update the group's items
        shapesToKeep.push(shape);
        // console.log(`  Keeping group '${shape.nm || 'Unnamed'}' as it has children.`);
      } else {
        // console.log(`  Removing empty group '${shape.nm || 'Unnamed'}'.`);
      }
      continue; // Process next shape
    }

    // For all other shape types (geometry, transform, merge, etc.)
    // Keep the shape ONLY if the current color context is blue
    if (currentBlueStatus) {
      shapesToKeep.push(shape);
      // console.log(`  Keeping shape '${shape.nm || shapeType}' because current color is blue.`);
    } else {
      // Discard the shape if the current color context is NOT blue
      // console.log(`  Removing shape '${shape.nm || shapeType}' because current color is NOT blue.`);
    }
  }

  return { shapesToKeep: shapesToKeep };
}

/**
 * Loads, processes (removes elements), and saves a single Lottie file.
 * @param {string} filepath - Absolute path to the Lottie JSON file.
 */
function processLottieFile(filepath) {
  console.log(`Processing file: ${filepath}...`);
  try {
    const fileContent = fs.readFileSync(filepath, "utf-8");
    let data = JSON.parse(fileContent); // Use 'let' as we modify 'data'

    if (!data || !Array.isArray(data.layers)) {
      console.log("  Invalid Lottie structure. Skipping.");
      return;
    }

    let fileModified = false;
    // Process layers - create a new array of layers to keep
    const layersToKeep = [];
    data.layers.forEach((layer, i) => {
      console.log(`  Processing Layer ${i} ('${layer.nm || "Unnamed"}')`);
      let layerShouldBeKept = true; // Assume layer is kept unless emptied

      if (Array.isArray(layer.shapes)) {
        const originalShapeCount = layer.shapes.length;
        const result = processShapes(layer.shapes); // Start recursion
        layer.shapes = result.shapesToKeep; // Replace shapes with the filtered list

        if (layer.shapes.length < originalShapeCount) {
          console.log(
            `    -> Removed ${
              originalShapeCount - layer.shapes.length
            } shape items from layer.`
          );
          fileModified = true;
        }
        // If layer has no shapes left, maybe remove it? (Optional, could break layer ordering/dependencies)
        // For now, we keep the layer even if shapes are empty, unless you want to change this.
        // layerShouldBeKept = layer.shapes.length > 0;
      }
      // Decide whether to keep the layer based on the flag
      if (layerShouldBeKept) {
        layersToKeep.push(layer);
      } else {
        console.log(
          `    -> Removing empty layer ${i} ('${layer.nm || "Unnamed"}').`
        );
        fileModified = true; // Mark file as modified if layer is removed
      }
    });

    // Update the main data object only if layers were potentially removed
    if (layersToKeep.length < data.layers.length) {
      data.layers = layersToKeep; // Update the layers array in the data object
    }

    if (fileModified) {
      console.log(
        `  Elements potentially removed. Saving changes to ${filepath}`
      );
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
    } else {
      console.log("  No elements identified for removal.");
    }
  } catch (e) {
    console.error(`  Error processing file ${filepath}:`, e);
  }
}

// --- Main Execution ---
if (!fs.existsSync(LOTTIE_DIR)) {
  console.error(`Error: Directory not found: ${LOTTIE_DIR}`);
  process.exit(1);
}

console.log(`Scanning directory: ${LOTTIE_DIR}`);
fs.readdir(LOTTIE_DIR, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    process.exit(1);
  }

  files.forEach((filename) => {
    if (filename.toLowerCase().endsWith(".json")) {
      const filepath = path.join(LOTTIE_DIR, filename);
      processLottieFile(filepath);
    }
  });

  console.log("\nScript finished.");
});
